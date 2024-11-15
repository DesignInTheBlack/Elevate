// Import Design System Key/Value Pairs -- Need to Implement Property/Modifier Map To Allow For Order Agnostic Modifier Handling
// We'll achieve this by creating a config file that maps the specific properties to the modifiers they accept and their preferred types from the design system. 
// This should in theory allow us to compile styles based on which modifier matches which token type. 

//These made require separate validation
import {BreakpointToken} from "./design/breakpoints.js"
import {BufferToken} from "./design/buffer.js";
//Modifier Validation
import {ColorToken,colors} from "./design/colors.js"
import {SpacingToken,spacing} from "./design/spacing.js"
import {FontSizeToken,typography} from "./design/typography.js";
import {FontFamilyToken} from "./design/typography.js";
import {LineHeightToken} from "./design/typography.js";
import {LetterSpacingToken} from "./design/typography.js";


export function toAst(cst: any) {
    if (!cst) {
        throw new Error("No CST to convert.");
    }
    // For demonstration purposes, just converting to a basic AST structure
    return {
        type: "Stateless Class",
        className: cst.className,
        property: cst.children.Property[0].image,
        modifiers: cst.children.ColonModifier.map((mod: any) => mod.image.replace(":", "")),
    };
}


export function getModifierType(modifier: string): string | null {
    const types = {
        ColorToken: Object.keys(colors),
        SpacingToken:Object.keys(spacing),
        FontSizeToken:Object.keys(typography.size),
        FontFamilyToken:Object.keys(typography.family),
        LineHeightToken:Object.keys(typography.leading),
        LetterSpacingToken:Object.keys(typography.tracking)
    };

    for (const [typeName, values] of Object.entries(types)) {
        if (values.includes(modifier)) {
            return typeName;
        }
    }

    return "Undefined"; // No match found
}