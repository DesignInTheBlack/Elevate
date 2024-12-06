import fs from 'fs';

// ╔════════════════════════════════════════════════════════════════════╗
// ║                  GLOBAL ERROR HANDLING                             ║
// ║ Setup error stack trace limit and uncaught exception handler.      ║
// ╚════════════════════════════════════════════════════════════════════╝
Error.stackTraceLimit = 0;
process.on('uncaughtException', (err) => {
    console.log('\x1b[31m%s\x1b[0m', err.message); // Red color
    process.exit(1);
});

// ╔════════════════════════════════════════════════════════════════════╗
// ║                   MODULE IMPORTS                                   ║
// ║      Import configurations, tokens, and utilities.                 ║
// ╚════════════════════════════════════════════════════════════════════╝

//Configuration Options
import {config} from './config/elevate.js';

//CSS Reset
import {cssReset} from './design/reset.js';

//Syntax Maps
import {propertyAttributeMap, propertyMap} from "./maps/propertyAttributeMap.js";
import {flex} from './maps/flex.js';
import {border} from './maps/border.js';
import {text} from './maps/text.js';

//Design Tokens
import {breakpoints, BreakpointToken } from "./design/breakpoints.js";
import {colors} from "./design/colors.js";
import {spacing,SpacingToken} from "./design/spacing.js";
import {typography} from "./design/typography.js";
import {buffer} from './design/buffer.js';


// ╔════════════════════════════════════════════════════════════════════╗
// ║                   TOKEN TYPES CONFIGURATION                        ║
// ║ Map various tokens to their respective values for validation.      ║
// ╚════════════════════════════════════════════════════════════════════╝

const types = {
    xAxis: flex.xAxis,
    yAxis: flex.yAxis,
    ColorToken: colors,
    SpacingToken: spacing,
    FontSizeToken: typography.size,
    FontFamilyToken: typography.family,
    LineHeightToken: typography.leading,
    LetterSpacingToken: typography.tracking,
    BreakPointToken: breakpoints,
    BorderWidthToken: border.width,  
    BorderRadiusToken: border.radius, 
    BorderStyleToken: border.style,
    FlexGrowToken: flex.flexGrowToken,
    FlexShrinkToken: flex.flexShrinkToken,
    FlexSelfToken: flex.flexSelfToken,
    FlexOrderToken: flex.flexOrderToken,
    FlexBasisToken: flex.flexBasisToken,
    fontweightToken: typography.weight,
    TextAlignToken: text.align,
};

// ╔════════════════════════════════════════════════════════════════════╗
// ║                   MODIFIER HANDLING FUNCTIONS                      ║
// ║ Functions to retrieve types, values, and rules for modifiers.      ║
// ╚════════════════════════════════════════════════════════════════════╝

// Get the type of a modifier based on its key in the types map.
export function getModifierType(modifier: string, context?: { fileName: string } ): string {
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
    
    throw new Error(
            `\nUnable to determine token type for value: ${modifier}${context ? ` in ${context.fileName}` : ''}\nPlease ensure that you are using a valid token as defined in the design directory.`
    );
}

// Get the value of a modifier by searching its mapped values.
export function getModifierValue(modifier: string, context?: { fileName: string }): string {
    if (isAxisSpecificModifier(modifier)) {
        return getAxisSpecificValue(modifier);
    }
    
    const value = getGeneralTokenValue(modifier);
    if (value) {
        return value;
    }

    return handleCompoundToken(modifier, context);
}

// Preprocess the modifiers array for directional utilities.
function preprocessModifiers(modifiers: any[]): any[] {
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

// Check if the modifier is axis-specific
function isAxisSpecificModifier(modifier: string): boolean {
    return modifier.startsWith('x-') || modifier.startsWith('y-');
}

// Get value for axis-specific tokens
function getAxisSpecificValue(modifier: string): string {
    if (modifier.startsWith('x-') && modifier in types.xAxis) {
        return types.xAxis[modifier];
    }
    if (modifier.startsWith('y-') && modifier in types.yAxis) {
        return types.yAxis[modifier];
    }
    throw new Error(`\nAxis-specific modifier not found: ${modifier}`);
}

// Retrieve token from general types map
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

// Handle compound tokens by breaking into prefix and value
function handleCompoundToken(modifier: string, context?: { fileName: string }): string {
    const [prefix, value] = modifier.split('-');
    for (const [typeName, values] of Object.entries(types)) {
        if (`${prefix}-` in values) {
            const tokenType = values[`${prefix}-`];
            if (tokenType === "PassThrough") {
                return value;
            }
            return validateAndRetrieveCompoundValue(tokenType, value, modifier, context);
        }
    }
}

// Validate compound token and retrieve value
function validateAndRetrieveCompoundValue(
    tokenType: string,
    value: string,
    modifier: string,
    context?: { fileName: string }
): string {
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
            }, [])
            .map(group => group.join(', '))
            .join('\n    ');
        throw new Error(
            `\nInvalid ${tokenType.toLowerCase()} value: ${value}${context ? ` in ${context.fileName}` : ''}\nPlease examine this utility string and examine prefixes, modifiers, etc.`
        );
    }
    return types[tokenType][value];
}

 //Get the rule name for a given modifier and property using a property map.
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
// ║                   CST TO AST CONVERSION                            ║
// ║    Function to convert CST into AST with detailed structure.       ║
// ╚════════════════════════════════════════════════════════════════════╝

// Main function to determine and delegate CST conversion logic.
export function toAst(cst: any, context?: { fileName: string }) {
    if (!cst) {
        throw new Error("No CST to convert.");
    }

    return cst.children.DirectProperty
        ? handleDirectProperties(cst)
        : handleCompoundProperties(cst, context);
}

// Handles the logic for direct properties within the CST.
function handleDirectProperties(cst: any) {
    const directProp = cst.children.DirectProperty[0].image;
    return {
        type: "Direct Class",
        className: cst.className,
        property: directProp,
        modifiers: [
            `display: ${propertyAttributeMap[directProp].display}`
        ],
    };
}

// Handles the logic for compound properties within the CST.
function handleCompoundProperties(cst: any, context?: { fileName: string }) {
    return {
        type: cst.children.stateFlag ? "Stateful Class" : "Stateless Class",
        className: cst.className,
        ...(cst.children.stateFlag && {
            state: extractState(cst.children.stateFlag),
        }),
        property: cst.children.Property[0].image,
        modifiers: processModifiers(cst, context),
    };
}

// Extracts the state from the stateFlag property of the CST.
function extractState(stateFlag: any) {
    return stateFlag[0].image.replace("@", "").replace(":", "");
}

// Processes and maps the modifiers for the given property.
function processModifiers(cst: any, context?: { fileName: string }) {
    const property = cst.children.Property[0].image;
    const directions = ["left", "top", "right", "bottom"];

    // Preprocess modifiers based on property type
    const modifiers =
        property === "p" || property === "m" || property === "inset"
            ? preprocessModifiers(cst.children.ColonModifier)
            : cst.children.ColonModifier;

    // Map and construct rules for each modifier
    return modifiers.map((mod: any, index: number) => {
        const modifier = mod.image.replace(":", "");
        const modType =
            property === "p" || property === "m" || property === "inset"
                ? directions[index % directions.length]
                : getModifierType(modifier,context);

        return constructRule(modType, property, modifier, context);
    });
}

// Constructs a rule string based on the modifier type, property, and context.
function constructRule(modType: string, property: string, modifier: string, context?: { fileName: string }) {
    return (
        getRuleName(modType, property, propertyAttributeMap) +
        ": " +
        getModifierValue(modifier, context)
    );
}

// ╔════════════════════════════════════════════════════════════════════╗
// ║                  BREAKPOINT PRIORITY FUNCTION                      ║
// ║ Retrieve breakpoint priority based on its position in the map.     ║
// ╚════════════════════════════════════════════════════════════════════╝

export function getBreakpointPriority(breakpoint: string): number {
    const clean = breakpoint.replace(/\//g, '') as BreakpointToken;
    return Object.keys(breakpoints).indexOf(clean);
}

// ╔════════════════════════════════════════════════════════════════════╗
// ║                   Write To File                                    ║
// ║ Retrieve breakpoint priority based on its position in the map.     ║
// ╚════════════════════════════════════════════════════════════════════╝

export function writeToFile(content: string) {
    const filePath = `${config.Output}/elevate.css`; // Define the file path
  
    // Clear or create the file
    fs.writeFileSync(filePath, '', 'utf8'); // Ensures a clean slate

    //Compose Buffer CSS
    let bufferString = '';
    Object.entries(buffer).forEach(([key, value]) => {
        // Type-safe casting to preserve the types
        const breakpointKey = key as BreakpointToken;
        const spacingValue = value as SpacingToken;
    
        // Resolve actual values
        const minWidth = breakpoints[breakpointKey]; // e.g., '320px'
        const padding = spacing[spacingValue];      // e.g., '1.25rem'
    
        // Create CSS entry
        let newEntry = `
    @media only screen and (min-width:${minWidth}) {
        .buffer {
            padding-left: ${padding};
            padding-right: ${padding};
        }
    }`;
        bufferString += newEntry;
    });
    
  
    // Combine the reset CSS with the provided content
    const completeContent = `${cssReset}\n\n${bufferString}\n\n${content}`;
  
    // Write to the file
    fs.writeFile(filePath, completeContent, (err: any) => {
      if (err) {
        console.error('Error writing to the file:', err);
      } else {
        console.log('Content written to elevate.css successfully!');
      }
    });
  }