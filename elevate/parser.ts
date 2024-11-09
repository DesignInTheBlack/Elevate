import { createToken, Lexer, IToken, TokenType } from "chevrotain";

// Define our AST types
type UtilityNode = {
    type: 'utility';
    name: string;
    value: string;
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

// Fixed the token array type
const allTokens: TokenType[] = [
    Property,
    Colon
];

const lexer = new Lexer(allTokens,{positionTracking: "onlyOffset"});

function parseToAST(input: string): ASTNode {
    const tokenResult = lexer.tokenize(input);
    
    if (tokenResult.errors.length > 0) {
        throw new Error(`Lexing errors encountered: ${tokenResult.errors}`);
    }
    
    const tokens: IToken[] = tokenResult.tokens;
    
    if (tokens.length !== 3) {
        throw new Error('Invalid utility format. Expected property:value');
    }
    
    return {
        type: "utility",
        name: tokens[0].image,
        value: tokens[2].image
    };
}

export { parseToAST, type ASTNode, type UtilityNode };