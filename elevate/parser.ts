// ╔════════════════════════════════════════════════════════════════════╗
// ║                 1. IMPORT STATEMENTS                               ║
// ║ Import Chevrotain library and utility functions.                   ║
// ╚════════════════════════════════════════════════════════════════════╝
import { createToken, Lexer, CstParser, CstNode } from "chevrotain";
import { toAst } from "./utility.js";


// ╔════════════════════════════════════════════════════════════════════╗
// ║                 2. TOKEN DEFINITIONS                               ║
// ║ Define core tokens using Chevrotain's `createToken`.               ║
// ╚════════════════════════════════════════════════════════════════════╝
const State = createToken({ name: "stateFlag", pattern: /@[a-zA-Z][a-zA-Z0-9_-]+:/ });
const openState = createToken({ name: "openState", pattern: /\[/ });
const DirectProperty = createToken({ name: "DirectProperty", pattern: /[a-zA-Z][a-zA-Z0-9_-]*/ });
const Property = createToken({ name: "Property", pattern: /[a-zA-Z]+(?=:)/ });
const Modifier = createToken({ name: "ColonModifier", pattern: /:[a-zA-Z0-9][a-zA-Z0-9_-]*/ });
const closeState = createToken({ name: "closeState", pattern: /\]/ });
const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED
});

// ╔════════════════════════════════════════════════════════════════════╗
// ║              3. COMBINE TOKENS INTO VOCABULARY                     ║
// ║ Group defined tokens into a single array for Lexer initialization. ║
// ╚════════════════════════════════════════════════════════════════════╝
const tokens = [WhiteSpace, State, openState, Property, Modifier, DirectProperty, closeState];

// ╔════════════════════════════════════════════════════════════════════╗
// ║                   4. LEXER INITIALIZATION                          ║
// ║ Initialize the Lexer with the vocabulary.                          ║
// ╚════════════════════════════════════════════════════════════════════╝
const lexer = new Lexer(tokens, {
    positionTracking: "onlyOffset" // Disable line and column tracking
});

// ╔════════════════════════════════════════════════════════════════════╗
// ║                   5. PARSER DEFINITION                             ║
// ║ Define the `ElevateParser` class to process token streams.         ║
// ╚════════════════════════════════════════════════════════════════════╝
class ElevateParser extends CstParser {
    // Declare propertyDefinition explicitly for TypeScript compliance
    public propertyDefinition!: () => CstNode;
    public stateBlock!: () => CstNode;

    constructor() {
        super(tokens);
        const $ = this;

        $.RULE("stateBlock", () => {
            $.CONSUME(State);
            $.CONSUME(openState);
            $.AT_LEAST_ONE(() => {
                $.CONSUME(Property);
                $.CONSUME(Modifier);
            });
            $.CONSUME(closeState);
        });

        $.RULE("propertyDefinition", () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($.stateBlock);
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(DirectProperty);
                    }
                },
                {
                    ALT: () => {
                        // multiple properties and modifiers without the @hover block
                        $.MANY(() => {
                            $.CONSUME(Property);
                            $.MANY2(() => {
                                $.CONSUME(Modifier);
                            });
                        });
                    }
                }
            ]);
        });

        // Perform self-analysis to initialize parser internals
        this.performSelfAnalysis();
    }
}


// ╔════════════════════════════════════════════════════════════════════╗
// ║                   6. COMPILER FUNCTION                            ║
// ║ Define the `elevateCompiler` function to process input classes.   ║
// ╚════════════════════════════════════════════════════════════════════╝
export const elevateCompiler = (className: string,context?: { fileName: string }): any => {
    const parser = new ElevateParser();
    const result = lexer.tokenize(className);

    // Lexing Error Handling
    if (result.errors.length > 0) {
        console.error("Lexing errors detected:", result.errors);
        return;
    }

    // Set tokens for parser input
    parser.input = result.tokens;

    // Parse input using the primary rule
    const cst = parser.propertyDefinition();
    (cst as any).className = className;
    console.log("ClassName:" + className)

    // Parsing Error Handling 
    if (parser.errors.length > 0) {
        console.error("Parsing errors detected:", parser.errors);
        return;
    }

    // Generate AST from CST using `toAst`
    const ast = toAst(cst,context);

    // Return the AST
    return ast;
};
