import { createToken, Lexer, IToken, TokenType } from "chevrotain";
import * as elevate from './features/syntax.js';

// Define our AST types
type UtilityNode = {
    type: 'utility';
    property: string;
    modifiers: {
        [key: string]: string; // e.g. { color: 'blue' }
    }
};

type ASTNode = UtilityNode;

// Token definitions
const Property = createToken({
    name: "Property",
    pattern: /[a-z]+/
});

const Colon = createToken({
    name: "Colon", 
    pattern: /:/
});

const ModifierValue = createToken({
    name: "ModifierValue",
    pattern: /[a-z][a-z0-9]*/
});

const allTokens: TokenType[] = [
    Property,
    Colon,
    ModifierValue
];

const lexer = new Lexer(allTokens, {positionTracking: "onlyOffset"});

function parseToAST(input: string): ASTNode {
    const tokenResult = lexer.tokenize(input);
    
    if (tokenResult.errors.length > 0) {
        throw new Error(`Lexing errors encountered: ${tokenResult.errors}`);
    }
    
    const tokens: IToken[] = tokenResult.tokens;
    
    // Get property name (first token)
    const propertyName = tokens[0].image;
    
    // Check if property exists in syntax
    if (!(propertyName in elevate.syntax.sequences)) {
        throw new Error(`Invalid property: ${propertyName}`);
    }

    const property = elevate.syntax.sequences[propertyName as elevate.ValidProperties];

    // Get modifier value (third token)
    const modifierValue = tokens[2].image;

    
    // For now, assume it's a color modifier
    // Check if value is valid for color modifier
    if (!property.modifiers.color.allowedValues.includes(modifierValue as elevate.ValidColorValues)) {
        throw new Error(`Invalid color value: ${modifierValue}`);
    }

    return {
        type: "utility",
        property: propertyName,
        modifiers: {
            color: modifierValue
        }
    };
}

export { parseToAST, type ASTNode, type UtilityNode };