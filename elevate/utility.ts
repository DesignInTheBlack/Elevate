import fs from 'fs';
const path = './elevate.css';

// ╔════════════════════════════════════════════════════════════════════╗
// ║                 1. GLOBAL ERROR HANDLING                           ║
// ║ Setup error stack trace limit and uncaught exception handler.      ║
// ╚════════════════════════════════════════════════════════════════════╝
Error.stackTraceLimit = 0;
process.on('uncaughtException', (err) => {
    console.log('\x1b[31m%s\x1b[0m', err.message); // Red color
    process.exit(1);
});

// ╔════════════════════════════════════════════════════════════════════╗
// ║                  2. MODULE IMPORTS                                ║
// ║ Import configurations, tokens, and utilities.                     ║
// ╚════════════════════════════════════════════════════════════════════╝
import {propertyAttributeMap, propertyMap} from "./config/propertyAttributeMap.js";
import {breakpoints, BreakpointToken } from "./design/breakpoints.js";
import {colors } from "./design/colors.js";
import {spacing } from "./design/spacing.js";
import {typography } from "./design/typography.js";
import {flex} from './design/flex.js';

// ╔════════════════════════════════════════════════════════════════════╗
// ║                  3. TOKEN TYPES CONFIGURATION                     ║
// ║ Map various tokens to their respective values for validation.      ║
// ╚════════════════════════════════════════════════════════════════════╝
const types = {
    RowMainToken:flex.rowMain,
    RowCrossToken:flex.rowCross,
    ColMainToken:flex.colMain,
    ColCrossToken:flex.colMain,
    ColorToken: colors,
    SpacingToken: spacing,
    FontSizeToken: typography.size,
    FontFamilyToken: typography.family,
    LineHeightToken: typography.leading,
    LetterSpacingToken: typography.tracking,
};

// ╔════════════════════════════════════════════════════════════════════╗
// ║                   4. MODIFIER HANDLING FUNCTIONS                  ║
// ║ Functions to retrieve types, values, and rules for modifiers.      ║
// ╚════════════════════════════════════════════════════════════════════╝

/**
 * Get the type of a modifier based on its key in the types map.
 */
export function getModifierType(modifier: string): string | null {
    for (const [typeName, values] of Object.entries(types)) {
        if (modifier in values) {
            return typeName;
        }
    }
    throw new Error(`Unable to find type for modifier: ${modifier}`);
}

/**
 * Get the value of a modifier by searching its mapped values.
 */
export function getModifierValue(modifier: string): string | null {
    for (const [typeName, values] of Object.entries(types)) {
        if (modifier in values) {
            return (values as Record<string, string>)[modifier];
        }
    }
    throw new Error(`Unable to find matching value for modifier: ${modifier}`);
}

/**
 * Get the rule name for a given modifier and property using a property map.
 */
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
            (k) => match[k as keyof typeof match] === modifier
        ) || "no-match";
        return key;
    } else {
        return "no match!";
    }
}

// ╔════════════════════════════════════════════════════════════════════╗
// ║                   5. CST TO AST CONVERSION                       ║
// ║ Function to convert CST into AST with detailed structure.         ║
// ╚════════════════════════════════════════════════════════════════════╝

export function toAst(cst: any) {
    if (!cst) {
        throw new Error("No CST to convert.");
    }

    return {
        type: cst.children.stateFlag ? "Stateful Class" : "Stateless Class",
        className: cst.className,
        ...(cst.children.stateFlag && {
            state: cst.children.stateFlag
                ? cst.children.stateFlag[0].image.replace("@", "").replace(":", "")
                : null,
        }),
        property: cst.children.Property[0].image,

        modifiers: cst.children.ColonModifier.map((mod: any) => {
            let modifier = mod.image.replace(":", "");
            let property = cst.children.Property[0].image;
            let modType = getModifierType(modifier);

            let constructedRule =
                getRuleName(modType, property, propertyAttributeMap) +
                ": " +
                getModifierValue(modifier);
            return constructedRule;
        }),
    };
}

// ╔════════════════════════════════════════════════════════════════════╗
// ║                  6. BREAKPOINT PRIORITY FUNCTION                  ║
// ║ Retrieve breakpoint priority based on its position in the map.    ║
// ╚════════════════════════════════════════════════════════════════════╝

export function getBreakpointPriority(breakpoint: string): number {
    const clean = breakpoint.replace(/\//g, '') as BreakpointToken;
    return Object.keys(breakpoints).indexOf(clean);
}

// ╔════════════════════════════════════════════════════════════════════╗
// ║                  6. Write To File                                  ║
// ║ Retrieve breakpoint priority based on its position in the map.     ║
// ╚════════════════════════════════════════════════════════════════════╝

export function writeToFile(content: string) {
    const filePath = 'elevate.css'; // Define the file path
  
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      console.log('File exists. Clearing contents...');
      fs.writeFileSync(filePath, ''); // Clear the file by overwriting with an empty string
      console.log('File cleared successfully.');
    } else {
      console.log('File does not exist. Creating it...');
      fs.writeFileSync(filePath, ''); // Create an empty file
      console.log('File created successfully.');
    }
  
    // Write to the file
    fs.writeFile(filePath, content, (err: any) => {
      if (err) {
        console.error('Error writing to the file:', err);
      } else {
        console.log('Content written to elevate.css successfully!');
      }
    });
  }