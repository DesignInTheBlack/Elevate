// Import Chevrotain and Utility Functions
import { createToken, Lexer, CstParser, CstNode} from "chevrotain";
import {toAst,getModifierType} from "./utility.js";



// Core Token Definitions
const Property = createToken({ name: "Property", pattern: /[a-zA-Z]+(?=:)/ });
const Modifier = createToken({name: "ColonModifier",pattern: /:[a-zA-Z][a-zA-Z0-9_-]*/});

// Combine Tokens into Vocabulary
const tokens = [Property, Modifier];

// Initialize Lexer
const lexer = new Lexer(tokens);

// Parser Definition
class ElevateParser extends CstParser {
    // Explicitly declare the `propertyDefinition` method to make TypeScript happy
    public propertyDefinition!: () => CstNode;
    constructor() {
        super(tokens);
        const $ = this;

        // Define the "propertyDefinition" rule
        $.RULE("propertyDefinition", () => {
            $.CONSUME(Property);
            $.MANY(() => {  
                $.CONSUME(Modifier) 
            });
        });

        // Perform self-analysis to initialize the parser
        this.performSelfAnalysis();
    }
}

// The compiler function
export const elevateCompiler = (className: string): void => {
    const parser = new ElevateParser();
    const result = lexer.tokenize(className);

    // Check for lexing errors
    if (result.errors.length > 0) {
        console.error("Lexing errors detected:", result.errors);
        return;
    }
    
    // Set the input tokens for the parser
    parser.input = result.tokens;

    // Parse the input by calling the parser's rule directly
    const cst = parser.propertyDefinition();
    (cst as any).className = className;

    if (parser.errors.length > 0) {
        console.error("Parsing errors detected:", parser.errors);
        return;
    }

    // Convert CST to AST
    const ast = toAst(cst); // Call toAst directly, not as a method of parser

    // Output the AST
    console.log("AST:", JSON.stringify(ast, null, 2));
};
