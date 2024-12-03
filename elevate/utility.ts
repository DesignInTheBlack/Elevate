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
import {propertyAttributeMap, propertyMap} from "./maps/propertyAttributeMap.js";
import {cssReset} from './design/reset.js';
import { config } from './config/elevate.js';
import {breakpoints, BreakpointToken } from "./design/breakpoints.js";
import {colors} from "./design/colors.js";
import {spacing} from "./design/spacing.js";
import {typography} from "./design/typography.js";
import {flex} from './maps/flex.js';

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
    BreakPointToken:breakpoints
};

// ╔════════════════════════════════════════════════════════════════════╗
// ║                   4. MODIFIER HANDLING FUNCTIONS                  ║
// ║ Functions to retrieve types, values, and rules for modifiers.      ║
// ╚════════════════════════════════════════════════════════════════════╝

/**
 * Get the type of a modifier based on its key in the types map.
 */
export function getModifierType(modifier: string): string {
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
export function getModifierValue(modifier: string): string {
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

    const directions = ["left", "top", "right", "bottom"];
    let directionIndex = 0;

    return {
        type: cst.children.stateFlag ? "Stateful Class" : "Stateless Class",
        className: cst.className,
        ...(cst.children.stateFlag && {
            state: cst.children.stateFlag
                ? cst.children.stateFlag[0].image.replace("@", "").replace(":", "")
                : null,
        }),
        property: cst.children.Property[0].image,

        modifiers: (() => {
            let property = cst.children.Property[0].image;

            // Preprocess only for p or m
            const modifiers =
                property === "p" || property === "m"
                    ? preprocessModifiers(cst.children.ColonModifier)
                    : cst.children.ColonModifier;

            return modifiers.map((mod: any, index: number) => {
                let modifier = mod.image.replace(":", "");
                let modType = "";

                if (property === "p" || property === "m") {
                    // Assign unique directions iteratively for properties p and m
                    modType = directions[index % directions.length];
                } else {
                    modType = getModifierType(modifier);
                }

                let constructedRule =
                    getRuleName(modType, property, propertyAttributeMap) +
                    ": " +
                    getModifierValue(modifier);
                return constructedRule;
            });
        })(),
    };
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
    const filePath = `${config.Output}/elevate.css`; // Define the file path
  
    // Clear or create the file
    fs.writeFileSync(filePath, '', 'utf8'); // Ensures a clean slate
  
    // Combine the reset CSS with the provided content
    const completeContent = `${cssReset}\n\n${content}`;
  
    // Write to the file
    fs.writeFile(filePath, completeContent, (err: any) => {
      if (err) {
        console.error('Error writing to the file:', err);
      } else {
        console.log('Content written to elevate.css successfully!');
      }
    });
  }