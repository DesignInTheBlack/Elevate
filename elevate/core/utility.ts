import fs from 'fs';
import path from 'path';
//Configuration Options
import { config } from '../config/elevate.js';

//Compiler
import { elevateCompiler } from './parser.js';

//Import CSS Reset
import { cssReset } from './system/etc/reset.js';

//Import Numeric Validation
import { numeric } from './system/etc/numeric.js';

//Core Syntax Mapping
import { declarationMap } from "./system/declarationMap.js";

//Import BreakPoints
import { breakpoints} from "./system/design/breakpoints.js";

//Import Spacing
import { spacing } from "./system/design/spacing.js";

//Import Contain Map
import { contain } from './system/etc/contain.js';

//Import Design System
import { designSystem } from '../config/design.js';

//Import SystemRules
import { elevateRules } from './system/elevateRules.js';

//Import User Rules
import { rules } from '../config/syntax.js';


// ╔════════════════════════════════════════════════════════════════════╗
// ║                  SETUP AND CONFIGURATION                           ║
// ║ Includes foundational setup, such as error handling and token maps.║
// ╚════════════════════════════════════════════════════════════════════╝

Error.stackTraceLimit = 0;
process.on('uncaughtException', (err) => {
    console.log('\x1b[31m%s\x1b[0m', err.message); // Red color
    process.exit(1);
});

const types = {

    ...designSystem,
    ...elevateRules,
    ...numeric,
    ...rules
    
};
// ╔════════════════════════════════════════════════════════════════════╗
// ║                   CST TO AST CONVERSION                            ║
// ║ Handles conversion of Concrete Syntax Trees (CST) into ASTs.       ║
// ╚════════════════════════════════════════════════════════════════════╝

// Converts a CST into an AST by identifying the block type and processing accordingly.
export function toAst(cst: any, context?: { fileName: string }) {
    if (!cst) {
        throw new Error("No CST to convert.");
    }

    let utilityAST = null
    if (cst.children.DirectProperty) {
        utilityAST = handleDirectProperties(cst,context)
    }

    else if (cst.children.PassthroughBlock) {
        utilityAST = handlePassThrough(cst)
    }

    else if (cst.children.ContextBlock) {
        utilityAST = handleContextFlags(cst,context)
    }
    else {
        utilityAST = handleCompoundProperties(cst, context);
    }
    return utilityAST
}

// Processes direct property classes, mapping a single property to its modifiers and returns an AST.
function handleDirectProperties(cst: any, context?: { fileName: string, lineNumber: number }) {
    const directProp = cst.children.DirectProperty[0].image;

    const propMap = declarationMap[directProp];

    if (!propMap) {
        throw new Error(
`\n\nDirect Property Unrecognized: Unrecognized property "${directProp}"${context ? ` in ${context.fileName} on line ${context.lineNumber}` : ''}

💡 Troubleshooting Tips:
1. Check for typos or mismatched case in the property name ${directProp}
2. If this is a custom property, review syntax.ts as well as any relevant rules accordingly.

For more information, refer to https://elevate-docs.pages.dev\n`
        );
    }

    return {
        type: "Direct Class",
        className: cst.className,
        property: directProp,
        modifiers: Object.entries(propMap).map(([prop, value]) => `${prop}: ${value}`),
    };
}

// Extracts state and subterms from stateful strings and returns a faux AST with modifiers.
function handleContextFlags(cst: any, context?: { fileName: string, lineNumber: number }) {
    // More robust state extraction
    const stateMatch = cst.className.match(/@([a-zA-Z0-9-]+):/);
    const subtermsMatch = cst.className.match(/\[([^\]]+)\]/);
    
    // Extract the state, ensuring it's the full state including hyphens
    let state = stateMatch ? stateMatch[1] : null;
    
    // Extract the subterms
    let subterms = subtermsMatch ? subtermsMatch[1].split(/_/).map(term => term.trim()) : []
    let newterms = subterms.map((item) => {
        item = elevateCompiler(item,context);
        return item.modifiers
    });
    let modifiers = newterms.flat();
    
    let fauxAST = {
        name: 'propertyDefinition',
        children: null,
        state, // Use the full state, including hyphens
        className: cst.className,
        modifiers
    }
    
    return fauxAST
}

// Handles pass-through blocks by mapping a property and its modifier directly to a CSS rule.
function handlePassThrough(cst: any, context?: { fileName: string, lineNumber: number }) {
    const passThroughMatch = cst.className.match(/^([^:]+):(.*)/);
    if (passThroughMatch) {
        const property = passThroughMatch[1];
        const modifier = passThroughMatch[2];

        const modType = getModifierType(modifier, property, context);



        let fauxAST = {
            name: 'propertyDefinition',
            children: null,
            property,
            className: cst.className,
            modifiers: [constructRule(modType, property, modifier, context)]
        }
        return fauxAST;
    }
}

// Handles compound property classes by extracting their modifiers and constructing a stateless class AST.
function handleCompoundProperties(cst: any, context?: { fileName: string, lineNumber: number }) {
    // Extract property from CST
    const property = cst.children.Property[0].image;

    // Validate property before processing
    if (!(property in declarationMap)) {
        throw new Error(
`\n\nInvalid: Unrecognized property "${property}"${context ? ` in ${context.fileName} on line ${context.lineNumber}` : ''}

💡 Troubleshooting Tips:
1. Check for typos in your class name
2. Ensure the property is defined in the declaration map

For more information, refer to https://elevate-docs.pages.dev\n`
        );
    }

    return {
        type: "Stateless Class",
        className: cst.className,
        property: property,
        modifiers: processModifiers(cst, context),
    };
}

// Processes modifiers for properties, potentially expanding directional values and constructing CSS rules.
function processModifiers(cst: any, context?: { fileName: string, lineNumber: number }) {
    const property = cst.children.Property[0].image;
    const directions = ["top", "left", "right", "bottom"];
    const directionsx = ["left", "right"];
    const directionsy = ["top", "bottom"];
    // Preprocess modifiers based on property type
    let modifiers = null;
    //Handle Directional Modifiers

       if (property === "pd" || property === "mg" || property === "inset" || property === "mg-y" || property === "pd-y" || property === "mg-x" || property === "pd-x") {

        modifiers =  directionExpansion(property,cst.children.ColonModifier)

       } 
       else {
        modifiers = cst.children.ColonModifier;
        }


    // Map and construct rules for each modifier
    return modifiers.map((mod: any, index: number) => {
        // Replace the colon in the mod.image string to get the modifier
        const modifier = mod.image.replace(":", "");
    
        // Determine the type of modifier based on the property
        let modType;
    
        if (property === "mg-y" || property === "pd-y") {
            // Use directionsy for "mg-y" or "pd-y"
            const directionIndex = index % directionsy.length;
            modType = [directionsy[directionIndex]];
        } else if (property === "mg-x" || property === "pd-x") {
            // Use directionsx for "mg-x" or "pd-x"
            const directionIndex = index % directionsx.length;
            modType = [directionsx[directionIndex]];
        } else if (property === "pd" || property === "mg" || property === "inset") {
            // Use directions for "pd", "mg", or "inset"
            const directionIndex = index % directions.length;
            modType = [directions[directionIndex]];
        } else {
            // Otherwise, determine the modifier type using the getModifierType function
            modType = getModifierType(modifier, property, context);
        }
    
        // Construct the rule using the modType, property, modifier, and context
        return constructRule(modType, property, modifier, context);
    });
    
}

// Constructs a single CSS rule line by combining a property and a resolved modifier value.
function constructRule(modType: string, property: string, modifier: string, context?: { fileName: string }) {
 
    return (
        getRuleName(modType, property, declarationMap, context) +
        ": " +
        getModifierValue(modifier, context)
    );
}

// ╔════════════════════════════════════════════════════════════════════╗
// ║                        Modifier Handling                           ║
// ║   Functions to identify, validate, and retrieve modifier values.   ║
// ╚════════════════════════════════════════════════════════════════════╝

// Determines the type of a given modifier (token) by checking known token maps and patterns.
export function getModifierType(
    modifier: string,
    property: string,
    context?: { fileName: string, lineNumber: number }
): string[] {
    const matches = [];

    // Extract the part after the first ':' if it exists, preserving the entire parenthetical content
    const cleanedModifier = modifier.includes(':')
        ? modifier.slice(modifier.indexOf('('))
        : modifier;


    if (/^\(.*\)$/.test(cleanedModifier)) {
        matches.push("PassThroughToken");
    }

    // Direct lookup for matches
    for (const [typeName, values] of Object.entries(types)) {
        if (modifier in values) {
            matches.push(typeName); // Add to matches array
        }
    }

  

    // Find the prefix (everything before the first `-`)
    const [prefix, ...rest] = modifier.split('-');
    const remaining = rest.join('-'); // Everything after the first `-`
    
  
    
    for (const [typeName, values] of Object.entries(types)) {
        if (`${prefix}-` in values) {
            matches.push(typeName); // Add to matches array
        }
    }
    

    // Numeric values for z-index
    if (!isNaN(parseInt(modifier, 10))) {
        matches.push("NumericToken");
    }

    // If no matches found, throw an error
    if (matches.length === 0) {
        throw new Error(
`\n\nModifier Validation Failed: Unable to determine modifier type for "${modifier}"${context ? ` in ${context.fileName} on line ${context.lineNumber}` : ''}

💡 Troubleshooting Tips:
1. Verify the modifier is correctly defined and that this property accepts it.
2. If this is custom syntax, review syntax.ts as well as any relevant rules and their expected token types.

For more information, refer to https://elevate-docs.pages.dev\n`
        );
    }

    // Return unique matches to avoid duplicates
    return [...new Set(matches)];
}


// Retrieves the actual CSS value for a given modifier by resolving it through token types and handlers.
export function getModifierValue(modifier: string, context?: { fileName: string, lineNumber: number }): string {

    const modifierType = getModifierType(modifier, context);

     if (modifierType[0] === "PassThroughToken") {
        // Extract value inside parentheses
        const match = modifier.match(/^\((.*)\)$/);
        return match ? match[1] : modifier;
    }

    if (modifierType[0] === "NumericToken") {
        return types.NumericToken.validate(modifier);
    }
    if (isAxisSpecificModifier(modifier)) {
        return getAxisSpecificValue(modifier);
    }
    const value = getGeneralTokenValue(modifier);
    if (value) {
        return value;
    }
    return handlePrefixModifier(modifier, context);
}

// Checks if a modifier is axis-specific (x- or y-) to handle direction-based token retrieval.
function isAxisSpecificModifier(modifier: string): boolean {
    return modifier.startsWith('x-') || modifier.startsWith('y-');
}

// Retrieves the mapped CSS value for axis-specific modifiers from the xAxis or yAxis token sets.
function getAxisSpecificValue(modifier: string): string {
    if (modifier.startsWith('x-') && modifier in types.xAxis) {
        return types.xAxis[modifier];
    }
    if (modifier.startsWith('y-') && modifier in types.yAxis) {
        return types.yAxis[modifier];
    }
    throw new Error(
`\n\nInvalid Axis Value: Unable to determine axis specific modifier for "${modifier}"${context ? ` in ${context.fileName} on line ${context.lineNumber}` : ''}

💡 Troubleshooting Tips:
For more information, refer to https://elevate-docs.pages.dev\n`

    );
}

// Attempts to find a given modifier in the general token maps and returns its corresponding value if found.
function getGeneralTokenValue(modifier: string): string | null {
    for (const [typeName, values] of Object.entries(types)) {
        if (['xAxis', 'yAxis'].includes(typeName)) {
            continue;
        }
        if (modifier in values) {
            return (values as Record<string, string>)[modifier];
        }
    }
    return null;
}

// Handles compound modifiers with prefixes (property:r-modifier), resolving their token types and retrieving validated values.
function handlePrefixModifier(modifier: string, context?: { fileName: string }): string {

    const [prefix, value] = modifier.split(/-(.+)/); 
    for (const [typeName, values] of Object.entries(types)) {
        if (`${prefix}-` in values) {
            const tokenType = values[`${prefix}-`];
            if (tokenType === "PassThroughToken") {
                return value;
            }
            return validateAndRetrievePrefixValue(tokenType, value, context);
        }
    }
}

// Validates and retrieves a compound value from a tokenType map, ensuring it is a recognized token value.
function validateAndRetrievePrefixValue(
    tokenType: string,
    value: string,
    context?: { fileName: string,lineNumber: number }
): string {
    // Special handling for NumericToken
    if (tokenType === "NumericToken") {
        return numeric.NumericToken.validate(value);
    }
    if (!(value in types[tokenType])) {
        const validValues = Object.keys(types[tokenType]);
        const formattedValues = validValues
            .reduce((acc, curr, idx) => {
                if (idx % 10 === 0) {
                    acc.push([curr]);
                } else {
                    acc[acc.length - 1].push(curr);
                }
                return acc;
            }, [] as string[][])
            .map(group => group.join(', '))
            .join('\n    ');
            throw new Error(
`\n\nInvalid Prefixed Value: Unable to determine ${tokenType.toLowerCase()} value "${value}"${context ? ` in ${context.fileName} on line ${context.lineNumber}` : ''}

💡 Troubleshooting Tips:
1. Examine your prefixed value and ensure it matches the expected token type.
2. If this is a custom modifier, ensure that you are using the correct syntax.

For more information, refer to https://elevate-docs.pages.dev\n`
            );
    }
    return types[tokenType][value];
}

// Expands shorthand directional modifiers (p, m, inset) into full sets of values for all four sides.
function directionExpansion(property: string,modifiers: any[]): any[] {

    if (property === "mg-y" || property === "pd-y" || property === "mg-x" || property === "pd-x") {
        console.log("I SEE THIS!");
        return Array(2).fill(modifiers[0]);
    }

    else {


    if (modifiers.length === 1) {
        // Expand a single value to all four sides
        return Array(4).fill(modifiers[0]);
    } else if (modifiers.length === 2) {
        // Expand two values: first for left/right, second for top/bottom
        return [modifiers[0], modifiers[1], modifiers[0], modifiers[1]];
    }
    // Default: no preprocessing if already 4 values
    return modifiers;

}


}

export function getRuleName(
    modifiers: string[],
    property: string,
    keys: typeof declarationMap,
    context?: { fileName: string, lineNumber: number }
): string  {

    function isPropertyIncluded(property: string): property is propertyMap {
        return property in keys;
    }

    if (isPropertyIncluded(property)) {
        const match = keys[property];

        // Iterate over modifiers and check each against the match object
        for (const modifier of modifiers) {
            for (const [key, value] of Object.entries(match)) {
                if (modifier.startsWith(value)) {
                    return key; // Return the first matching key
                }
            }
        }
    }
    // If no match found, return an empty string


    throw new Error(
`\n\nInvalid Property/Modifier Relationship: Property "${property}" does not accept modifiers of type "${modifiers}"${context ? ` in ${context.fileName} on line ${context.lineNumber}` : ''}

💡 Troubleshooting Tips:
1. Examine the property and the accepted modifier types.
2. Check for typos in both the property and the modifier names.

For more information, refer to https://elevate-docs.pages.dev\n`
                );


}



// ╔════════════════════════════════════════════════════════════════════╗
// ║                  Breakpoint Handling                               ║
// ║    Handles final CSS content output to a file.                     ║
// ╚════════════════════════════════════════════════════════════════════╝

// Determines the priority of a breakpoint by its index in the breakpoints map, used for responsive ordering.
export function getBreakpointPriority(breakpoint: string): number {
    const clean = breakpoint.replace(/\//g, '') as BreakpointToken;
    return Object.keys(breakpoints).indexOf(clean);
}
// ╔════════════════════════════════════════════════════════════════════╗
// ║                   FILE WRITING                                     ║
// ║        Handles final CSS content output to a file.                 ║
// ╚════════════════════════════════════════════════════════════════════╝

// Writes the compiled CSS content, along with reset and contain styles, to the elevate.css output file.
export function writeToFile(content: string) {
    const filePath = `${config.Output}/elevate.css`; // Define the file path
    // Clear or create the file
    fs.writeFileSync(filePath, '', 'utf8'); // Ensures a clean slate
    //Compose Contain CSS
    let containString = '';
    Object.entries(contain).forEach(([key, value]) => {
        // Type-safe casting to preserve the types
        const breakpointKey = key as BreakpointToken;
        const spacingValue = value as SpacingToken;
        // Resolve actual values
        const minWidth = breakpoints[breakpointKey]; // e.g., '320px'
        const padding = spacing[spacingValue];      // e.g., '1.25rem'
        // Create CSS entry
        let newEntry = `
@media only screen and (min-width:${minWidth}) {
.contain {
    margin:auto;
    padding-left: ${padding};
    padding-right: ${padding};
    }
}`;
        containString += newEntry;
    });


    (async () => {
        try {
            // Read all CSS from the file paths in config.extend
            const cssPromises = config.Extend.map(async (relativePath) => {
                try {
                    const absolutePath = path.resolve(relativePath);
                    return await fs.promises.readFile(absolutePath, 'utf8');
                } catch (readError) {
                    // Handle missing or unreadable files gracefully
                    console.warn(`Warning: Could not read file at ${relativePath}. Skipping.`);
                    return ''; // Return empty string for failed files
                }
            });
    
            // Wait for all CSS to be read
            const fetchedCSS = await Promise.all(cssPromises);
    
            // Combine the reset CSS, provided content, and fetched CSS
            const combinedCSS =
                `${cssReset}\n\n${containString}\n\n${content}\n\n${
                    fetchedCSS.filter(Boolean).join('\n\n') // Skip empty strings
                }`;
    
            // Write the combined content to the file
            fs.writeFile(filePath, combinedCSS, () => {});
        } catch (error) {
            console.error('Error during file processing:', error);
        }
    })();


}
