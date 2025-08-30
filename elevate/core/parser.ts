// ╔════════════════════════════════════════════════════════════════════╗
// ║                 1. IMPORT STATEMENTS                               ║
// ║ Import Chevrotain library and utility functions.                   ║
// ╚════════════════════════════════════════════════════════════════════╝
import { createToken, Lexer, CstParser } from "chevrotain";
import { toAst } from "./utility.js";
import type { CstNode } from "chevrotain";


// ╔════════════════════════════════════════════════════════════════════╗
// ║                 2. TOKEN DEFINITIONS                               ║
// ║ Define core tokens using Chevrotain's `createToken`.               ║
// ╚════════════════════════════════════════════════════════════════════╝
const State = createToken({ name: "stateFlag", pattern: /@[a-zA-Z0-9-]+:/ });
const openState = createToken({ name: "openState", pattern: /\[/ });
const DirectProperty = createToken({ 
    name: "DirectProperty", 
    pattern: /[-a-zA-Z][a-zA-Z0-9_-]*(?!:)/ 
});
const PassProperty = createToken({ 
    name: "PassProperty", 
    pattern: /:([\w\-()'".,\s:\/\.@#%=&?]+)/ 
});
const Property = createToken({ 
    name: "Property", 
    pattern: /[-a-zA-Z][a-zA-Z0-9-]*(?=:)/ 
});
const Modifier = createToken({ 
    name: "ColonModifier", 
    pattern: /:[a-zA-Z0-9][a-zA-Z0-9\-+.]*/ 
});
const closeState = createToken({ name: "closeState", pattern: /\]/ });
const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /_+/,
    group: Lexer.SKIPPED
});

// ╔════════════════════════════════════════════════════════════════════╗
// ║              3. COMBINE TOKENS INTO VOCABULARY                     ║
// ║ Group defined tokens into a single array for Lexer initialization. ║
// ╚════════════════════════════════════════════════════════════════════╝
const tokens = [State, openState, Property, Modifier, WhiteSpace, DirectProperty, PassProperty, closeState];

// ╔════════════════════════════════════════════════════════════════════╗
// ║                   4. LEXER INITIALIZATION                          ║
// ║ Initialize the Lexer with the vocabulary.                          ║
// ╚════════════════════════════════════════════════════════════════════╝


// ╔════════════════════════════════════════════════════════════════════╗
// ║                   5. PARSER DEFINITION                             ║
// ║ Define the `ElevateParser` class to process token streams.         ║
// ╚════════════════════════════════════════════════════════════════════╝
class ElevateParser extends CstParser {
    // Declare propertyDefinition explicitly for TypeScript compliance
    public PropertyDefinition!: () => CstNode;
    public ContextBlock!: () => CstNode;
    public PassthroughBlock!: () => CstNode;

    constructor() {
        super(tokens);
        const $ = this;

        $.RULE("ContextBlock", () => {
            $.CONSUME(State);
            $.CONSUME(openState);
        
            $.MANY(() => {
                $.OR([
                    {
                        ALT: () => {
                            $.CONSUME(DirectProperty); // Matches a direct property (no modifiers)
                        },
                    },
                    {
                        ALT: () => {
                            $.CONSUME(Property); // Matches a property
                            $.MANY2(() => {
                                $.CONSUME(Modifier); // Matches modifiers for the property
                            });
                        },
                    },
                ]);
            });
        
            $.CONSUME(closeState);
        });
        

        $.RULE("PassthroughBlock", () => {
            $.CONSUME(Property);
            $.CONSUME(PassProperty)
        });

        $.RULE("PropertyDefinition", () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($.ContextBlock);
                    }
                },
                {
                    ALT: () => {
                        $.SUBRULE($.PassthroughBlock);
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


class ParserManager {
    private static parser: ElevateParser | null = null;
    private static lexerInstance: Lexer | null = null;
    
    static getParser(): ElevateParser {
        if (!ParserManager.parser) {
            ParserManager.parser = new ElevateParser();
        }
        return ParserManager.parser;
    }
    
    static getLexer(): Lexer {
        if (!ParserManager.lexerInstance) {
            ParserManager.lexerInstance = new Lexer(tokens, {
                positionTracking: "onlyOffset"
            });
        }
        return ParserManager.lexerInstance;
    }
    
    static resetParser(parser: ElevateParser): void {
        // Clear parsing errors and input
        parser.errors = [];
        parser.input = [];
        
        // Reset token consumption tracking
        (parser as any).currIdx = 0;
        (parser as any).tokVector = [];
        (parser as any).tokVectorLength = 0;
        
        // Clear memoization cache
        if ((parser as any).memoizedResults) {
            (parser as any).memoizedResults = {};
        }
        
        // Reset backtracking state
        if ((parser as any).isBackTrackingStack) {
            (parser as any).isBackTrackingStack = [];
        }
        
        // Reset GAST (Grammar AST) cache if present
        if ((parser as any).gastCache) {
            (parser as any).gastCache = {};
        }
        
        // Reset any rule invocation stacks
        if ((parser as any).ruleInvocationStateUpdate) {
            (parser as any).ruleInvocationStateUpdate = [];
        }
    }
}

export const elevateCompiler = (className: string, context?: { fileName: string, lineNumber: number }): any => {
    const parser = ParserManager.getParser();
    const lexer = ParserManager.getLexer(); // Changed this line
    const result = lexer.tokenize(className);

    if (result.errors.length > 0) {
        console.error("Lexing errors detected:", result.errors);
        return;
    }

    parser.input = result.tokens;

    const cst = parser.PropertyDefinition();
    (cst as any).className = className;

    if (parser.errors.length > 0) {
        console.error("Parsing errors detected:", parser.errors);
        return;
    }

    const ast = toAst(cst, context);
    return ast;
};
