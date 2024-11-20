// Import Chevrotain and Utility Functions
import { createToken, Lexer, CstParser, CstNode} from "chevrotain";
import {toAst} from "./utility.js";



// Core Token Definitions
const State = createToken({ name: "stateFlag", pattern: /@[a-zA-Z][a-zA-Z0-9_-]+:/ });
const openState = createToken({ name: "openState", pattern: /\[/ });
const Property = createToken({ name: "Property", pattern: /[a-zA-Z]+(?=:)/ });
const Modifier = createToken({name: "ColonModifier",pattern: /:[a-zA-Z][a-zA-Z0-9_-]*/});
const closeState = createToken({name: "closeState",pattern: /\]/ });

// Combine Tokens into Vocabulary
const tokens = [State,openState,Property,Modifier,closeState];

// Initialize Lexer
const lexer = new Lexer(tokens);

// Parser Definition
class ElevateParser extends CstParser {
    // Explicitly declare the `propertyDefinition` method to make TypeScript happy
    public propertyDefinition!: () => CstNode;
    constructor() {
        super(tokens);
        const $ = this;

        $.RULE("propertyDefinition", () => {
            // Handle the optional State, openState, and closeState group
            $.OPTION(() => {
                $.CONSUME(State);
                $.CONSUME(openState);
            });
        
            // Consume the Property token
            $.CONSUME(Property);
        
            // Consume zero or more Modifiers
            $.MANY(() => {
                $.CONSUME(Modifier);
            });
        
            // Ensure the input ends after parsing
            $.OPTION2(() => {
                $.CONSUME(closeState); // Catch any dangling closeState
            });
        });

        // Perform self-analysis to initialize the parser
        this.performSelfAnalysis();
    }
}

// The compiler function
export const elevateCompiler = (className: string): any => {
    const parser = new ElevateParser();
    const result = lexer.tokenize(className);

    // Check for lexing errors
    if (result.errors.length > 0) {
        console.error("Lexing errors detected:", result.errors);
        return;
    }
    
    // Set the input tokens for the parser
    parser.input = result.tokens;
    console.log(result.tokens);

    // Parse the input by calling the parser's rule directly
    const cst = parser.propertyDefinition();
    (cst as any).className = className;

    if (parser.errors.length > 0) {
        console.error("Parsing errors detected:", parser.errors);
        return;
    }

    // Convert CST to AST
    console.log(cst);
    const ast = toAst(cst); // Call toAst directly, not as a method of parser

    // Output the AST
    return(JSON.stringify(ast, null, 2));
};
