import fs from 'fs';
//Configuration Options
import { config } from '../config/elevate.js';

//Compiler
import { elevateCompiler } from './parser.js';

//Import CSS Reset
import { cssReset } from '../etc/reset.js';

//Import Numeric Validation
import { numeric } from '../etc/numeric.js';

//Core Syntax Mapping
import { propertyAttributeMap } from "../rules/propertyAttributeMap.js";

//Import BreakPoints
import { breakpoints} from "../design/breakpoints.js";

//Import Spacing
import { spacing } from "../design/spacing.js";

//Import Contain Map
import { contain } from '../etc/contain.js';

//Import Design System
import { designSystem } from '../config/design.js';

//Import Rules
import { rulesMaster } from '../config/rules.js';

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
    ...rulesMaster
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

    // console.log(JSON.stringify(cst,null,2))

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

    const propMap = propertyAttributeMap[directProp];

    if (!propMap) {
        throw new Error(
    `\n\nDirect Property Unrecognized: Unrecognized property "${directProp}"${context ? ` in ${context.fileName} on line ${context.lineNumber}` : ''}

    💡 Troubleshooting Tips:
    1. Verify the property "${directProp}" is correctly defined in your property map
    2. Check for typos or mismatched case in the property name

    For more information, refer to the Elevate CSS documentation.\n`
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

        const modType = getModifierType(modifier, context);



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
    if (!(property in propertyAttributeMap)) {
        throw new Error(
            `\n\nInvalid: Unrecognized property "${property}"${context ? ` in ${context.fileName} on line ${context.lineNumber}` : ''}
    
    💡 Troubleshooting Tips:
    1. Check for typos in your class name
    2. Ensure the property is defined in the propertyAttributeMap

    For more information, refer to the Elevate CSS documentation.\n`
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
function processModifiers(cst: any, context?: { fileName: string }) {
    const property = cst.children.Property[0].image;
    const directions = ["left", "top", "right", "bottom"];
    // Preprocess modifiers based on property type
    const modifiers =
    //Handle Directional Modifiers
        property === "p" || property === "m" || property === "inset"
            ? directionExpansion(cst.children.ColonModifier)
            : cst.children.ColonModifier;
    // Map and construct rules for each modifier
    return modifiers.map((mod: any, index: number) => {
        const modifier = mod.image.replace(":", "");
        const modType =
            property === "p" || property === "m" || property === "inset"
                ? directions[index % directions.length]
                : getModifierType(modifier, context);
        return constructRule(modType, property, modifier, context);
    });
}

// Constructs a single CSS rule line by combining a property and a resolved modifier value.
function constructRule(modType: string, property: string, modifier: string, context?: { fileName: string }) {
    return (
        getRuleName(modType, property, propertyAttributeMap) +
        ": " +
        getModifierValue(modifier, context)
    );
}

// ╔════════════════════════════════════════════════════════════════════╗
// ║                        Modifier Handling                           ║
// ║   Functions to identify, validate, and retrieve modifier values.   ║
// ╚════════════════════════════════════════════════════════════════════╝

// Determines the type of a given modifier (token) by checking known token maps and patterns.
export function getModifierType(modifier: string, context?: { fileName: string, lineNumber: number }): string {

    // Extract the part after the first ':' if it exists, preserving the entire parenthetical content
    const cleanedModifier = modifier.includes(':') 
        ? modifier.slice(modifier.indexOf('(')) 
        : modifier;

    if (/^\(.*\)$/.test(cleanedModifier)) {
        return "PassThroughToken";
    }

    // First try direct lookup
    for (const [typeName, values] of Object.entries(types)) {
        if (modifier in values) {
            return typeName;
        }
    }
    // If not found, try compound modifier format
    const [prefix] = modifier.split('-');
    for (const [typeName, values] of Object.entries(types)) {
        if (`${prefix}-` in values) {
            return typeName;
        }
    }
    // Handle numeric values for z-index
    if (!isNaN(parseInt(modifier, 10))) {
        return "NumericToken";
    }
    throw new Error(
        `\n\nDesign Token Validation Failed: Unable to determine modifier token type for "${modifier}"${context ? ` in ${context.fileName} on line ${context.lineNumber}` : ''}
    
    💡 Troubleshooting Tips:
    1. Verify the modifier is correctly defined in your design tokens
    2. Examine submap or nested token configurations
    3. Ensure the modifier follows the expected design system syntax
    For more information, refer to the Elevate CSS documentation.\n`

    );
}

// Retrieves the actual CSS value for a given modifier by resolving it through token types and handlers.
export function getModifierValue(modifier: string, context?: { fileName: string, lineNumber: number }): string {
    const modifierType = getModifierType(modifier, context);

     if (modifierType === "PassThroughToken") {
        // Extract value inside parentheses
        const match = modifier.match(/^\((.*)\)$/);
        return match ? match[1] : modifier;
    }

    if (modifierType === "NumericToken") {
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
    1. Verify the modifier syntax matches the design system
    2. Check for typos in your class name
    3. Ensure the modifier is defined in one of the token maps
    For more information, refer to the Elevate CSS documentation.\n`

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
    const [prefix, value] = modifier.split('-');
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
    1. Examine your prefix value and ensure it matches the expected token type
    2. Confirm that the value is correctly defined in the relevant token map

    For more information, refer to the Elevate CSS documentation.\n`
            );
    }
    return types[tokenType][value];
}

// Expands shorthand directional modifiers (p, m, inset) into full sets of values for all four sides.
function directionExpansion(modifiers: any[]): any[] {
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

// Determines the correct CSS property name for a given modifier and property combination from the property map.
export function getRuleName(
    modifier: string,
    property: string,
    keys: typeof propertyAttributeMap
): string {
    function isPropertyIncluded(property: string): property is propertyMap {
        return property in keys;
    }
    if (isPropertyIncluded(property)) {
        let match = keys[property];
        const key = Object.keys(match).find(
            (k) => modifier.startsWith(match[k as keyof typeof match])
        ) || "no-match";
        return key;
    } else {
        return "no match!";
    }
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
    padding-left: ${padding};
    padding-right: ${padding};
    }
}`;
        containString += newEntry;
    });
    // Combine the reset CSS with the provided content
    const completeContent = `${cssReset}\n\n${containString}\n\n${content}`;
    // Write to the file
    fs.writeFile(filePath, completeContent, (err: any) => {
        if (err) {
            console.error('Error writing to the file:', err);
        } else {
            console.log('Content written to elevate.css successfully!');
        }
    });
}
