import fs from 'fs';
//Configuration Options
import { config } from './config/elevate.js';
import { elevateCompiler } from './parser.js';
//CSS Reset & Utility Tokens
import { cssReset } from './design/reset.js';
import { numeric } from './maps/numeric.js';
//Syntax Maps
import { propertyAttributeMap, propertyMap } from "./maps/propertyAttributeMap.js";
import { flex } from './maps/flex.js';
import { border } from './maps/border.js';
import { text } from './maps/text.js';
import { grid } from './maps/grid.js';
//Design Tokens
import { breakpoints, BreakpointToken } from "./design/breakpoints.js";
import { colors } from "./design/colors.js";
import { spacing, SpacingToken } from "./design/spacing.js";
import { typography } from "./design/typography.js";
import { buffer } from './design/buffer.js';
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
    ColorToken: colors,
    SpacingToken: spacing,
    FontSizeToken: typography.size,
    FontFamilyToken: typography.family,
    LineHeightToken: typography.leading,
    LetterSpacingToken: typography.tracking,
    FontWeightToken: typography.weight,
    TextAlignToken: text.align,
    TextTransformToken: text.transform,
    BreakPointToken: breakpoints,
    xAxis: flex.xAxis,
    yAxis: flex.yAxis,
    BorderWidthToken: border.width,
    BorderRadiusToken: border.radius,
    BorderStyleToken: border.style,
    FlexGrowToken: flex.flexGrowToken,
    FlexShrinkToken: flex.flexShrinkToken,
    FlexSelfToken: flex.flexSelfToken,
    FlexOrderToken: flex.flexOrderToken,
    FlexBasisToken: flex.flexBasisToken,
    NumericToken: numeric.NumericToken,
    GridGapToken: grid.gap,
    GridRowToken: grid.row,
    GridColumnToken: grid.column
};
// ╔════════════════════════════════════════════════════════════════════╗
// ║                   CST TO AST CONVERSION                            ║
// ║ Handles conversion of Concrete Syntax Trees (CST) into ASTs.       ║
// ╚════════════════════════════════════════════════════════════════════╝

export function toAst(cst: any, context?: { fileName: string }) {
    if (!cst) {
        throw new Error("No CST to convert.");
    }
    let managedCST = null
    if (cst.children.DirectProperty) {
        console.log(cst)
        managedCST = handleDirectProperties(cst)
    }
    else if (cst.children.stateBlock) {
        managedCST = handleStatefulStrings(cst)
    }
    else {
        managedCST = handleCompoundProperties(cst, context);
    }
    return managedCST
}

function handleDirectProperties(cst: any) {
    const directProp = cst.children.DirectProperty[0].image;
    const propMap = propertyAttributeMap[directProp];
    return {
        type: "Direct Class",
        className: cst.className,
        property: directProp,
        modifiers: Object.entries(propMap).map(([prop, value]) => `${prop}: ${value}`),
    };
}

function handleStatefulStrings(cst: any, context?: { fileName: string }) {
    const stateMatch = cst.className.match(/@(\w+):/); // Captures the term after `@` and before `:`
    const subtermsMatch = cst.className.match(/\[([^\]]+)\]/); // Captures terms inside `[]`
    // Extract the state correctly
    let state = stateMatch ? stateMatch[1] : null;
    // Extract the subterms
    let subterms = subtermsMatch ? subtermsMatch[1].split(/_/).map(term => term.trim()) : []
    let newterms = subterms.map((item) => {
        item = elevateCompiler(item);
        return item.modifiers
    });
    let modifiers = newterms.flat();
    let fauxAST = {
        name: 'propertyDefinition',
        children: null,
        state,
        className: cst.className,
        modifiers
    }
    return fauxAST
}

function handleCompoundProperties(cst: any, context?: { fileName: string }) {
    return {
        type: "Stateless Class",
        className: cst.className,
        property: cst.children.Property[0].image,
        modifiers: processModifiers(cst, context),
    };
}

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
                : getModifierType(modifier, context);
        return constructRule(modType, property, modifier, context);
    });
}

function constructRule(modType: string, property: string, modifier: string, context?: { fileName: string }) {
    return (
        getRuleName(modType, property, propertyAttributeMap) +
        ": " +
        getModifierValue(modifier, context)
    );
}

// ╔════════════════════════════════════════════════════════════════════╗
// ║                   MODIFIER HANDLING                                ║
// ║ Functions to identify, validate, and retrieve modifier values.     ║
// ╚════════════════════════════════════════════════════════════════════╝

export function getModifierType(modifier: string, context?: { fileName: string }): string {
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
        `\n❌ Design Token Validation Failed: Unable to determine token type for "${modifier}"${context ? ` in ${context.fileName}` : ''}
    🔍 Diagnostic Information:
    - Attempted Modifier: ${modifier}
    - Registered Token Types:
    ${Object.keys(types).map((key, index) =>
            index % 5 === 0 ? '\n    ' + key : key
        ).join(', ')}
    💡 Troubleshooting Tips:
    1. Verify the modifier is correctly defined in your design tokens
    2. Check for potential submap or nested token configurations
    3. Ensure the modifier follows the expected design system syntax
    For more information, refer to the Elevate CSS documentation.`
    );
}

function isAxisSpecificModifier(modifier: string): boolean {
    return modifier.startsWith('x-') || modifier.startsWith('y-');
}

export function getModifierValue(modifier: string, context?: { fileName: string }): string {
    const modifierType = getModifierType(modifier, context);
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
    return handleCompoundToken(modifier, context);
}

function getAxisSpecificValue(modifier: string): string {
    if (modifier.startsWith('x-') && modifier in types.xAxis) {
        return types.xAxis[modifier];
    }
    if (modifier.startsWith('y-') && modifier in types.yAxis) {
        return types.yAxis[modifier];
    }
    throw new Error(
        `\n❌ Invalid Token Configuration: Unable to determine token type for "${modifier}"${context ? ` in ${context.fileName}` : ''}
    🔍 Diagnostic Information:
    - Attempted Modifier: ${modifier}
    - Registered Token Types:
    ${Object.keys(types).map((key, index) =>
            index % 5 === 0 ? '\n    ' + key : key
        ).join(', ')}
    💡 Troubleshooting Tips:
    1. Verify the modifier syntax matches the design system
    2. Check for typos in your class name
    3. Ensure the modifier is defined in one of the token maps
    For more information, refer to the Elevate CSS documentation.`
    );
}

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

function validateAndRetrieveCompoundValue(
    tokenType: string,
    value: string,
    modifier: string,
    context?: { fileName: string }
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
            }, [])
            .map(group => group.join(', '))
            .join('\n    ');
        throw new Error(
            `\nInvalid ${tokenType.toLowerCase()} value: ${value}${context ? ` in ${context.fileName}` : ''}\nPlease examine this utility string and examine prefixes, modifiers, etc.`
        );
    }
    return types[tokenType][value];
}

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

// ╔════════════════════════════════════════════════════════════════════╗
// ║                   PROPERTY MAPPING                                 ║
// ║ Maps modifiers to CSS property names for rule construction.        ║
// ╚════════════════════════════════════════════════════════════════════╝

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
// ║                  BREAKPOINT HANDLING                               ║
// ║ Manages responsive behavior by determining breakpoint priorities.  ║
// ╚════════════════════════════════════════════════════════════════════╝

export function getBreakpointPriority(breakpoint: string): number {
    const clean = breakpoint.replace(/\//g, '') as BreakpointToken;
    return Object.keys(breakpoints).indexOf(clean);
}


// ╔════════════════════════════════════════════════════════════════════╗
// ║                   FILE WRITING                                     ║
// ║ Handles final CSS content output to a file.                        ║
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