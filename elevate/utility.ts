
//Limit Stack Trace to avoid overly robust errors - Revisit In Future.
Error.stackTraceLimit = 0; 

process.on('uncaughtException', (err) => {
    console.log('\x1b[31m%s\x1b[0m', err.message);  // Red color
    process.exit(1);
});

//Import Property Map
import {propertyAttributeMap,propertyMap,propertyKeys} from "./config/propertyAttributeMap.js";
//These may require separate validation
import {BreakpointToken} from "./design/breakpoints.js"
import {BufferToken} from "./design/buffer.js";
//Modifier Validation
import {ColorToken,colors} from "./design/colors.js"
import {SpacingToken,spacing} from "./design/spacing.js"
import {FontSizeToken,typography} from "./design/typography.js";
import {FontFamilyToken} from "./design/typography.js";
import {LineHeightToken} from "./design/typography.js";
import {LetterSpacingToken} from "./design/typography.js";

const types = {
    ColorToken: colors,
    SpacingToken: spacing,
    FontSizeToken: typography.size,
    FontFamilyToken: typography.family,
    LineHeightToken: typography.leading,
    LetterSpacingToken: typography.tracking,
};

export function getModifierType(modifier: string): string | null {
    for (const [typeName, values] of Object.entries(types)) {
        if (modifier in values) {
            return typeName;
        }
    }

    throw new Error(`Unable to find type for modifier: ${modifier}`);
}

export function getModifierValue(modifier:string): string | null {
    for (const [typeName, values] of Object.entries(types)) {
        if (modifier in values) {
           return (values as Record<string, string>)[modifier] 
        }
    }

    throw new Error(`Unable to find matching value for modifier: ${modifier}`);
}


export function getRuleName(
    modifier: string,
    property: string,
    keys: typeof propertyAttributeMap
  ): string {


    // Check if the property is included in the map
    function isPropertyIncluded(property: string): property is propertyMap {
        return property in keys;
    }
  
    // If the property exists, return the object from the map
    if (isPropertyIncluded(property)) {
      
        let match = keys[property]
        const key = Object.keys(match).find((k) => match[k as keyof typeof match] === modifier) || "no-match";
        return key

    } else {

      return "no match!";
      
    }
  }



export function toAst(cst: any) {
    if (!cst) {
        throw new Error("No CST to convert.");
    }

    return {
       
        type:  cst.children.stateFlag? "Stateful Class" : "Stateless Class",
        className: cst.className,
        ...(cst.children.stateFlag && {
        state:cst.children.stateFlag? cst.children.stateFlag[0].image.replace("@", "").replace(":", "") : null,
        }),
        property: cst.children.Property[0].image,

        modifiers: cst.children.ColonModifier.map((mod: any) => {

            let modifier = mod.image.replace(":", "");
            let property = cst.children.Property[0].image
            let modType = getModifierType(modifier);

            let constructedRule = getRuleName(modType,property,propertyAttributeMap) + ": " + getModifierValue(modifier);
            return constructedRule;
        
        }),
    };
}





