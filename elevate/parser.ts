// Import Chevrotain
import { createToken, Lexer, CstParser, CstNode, IToken } from "chevrotain";

// Import Design System Key/Value Pairs
import {BreakpointToken} from "./design/breakpoints.js"
import {BufferToken} from "./design/buffer.js";
import {ColorToken} from "./design/colors.js"
import {SpacingToken} from "./design/spacing.js"
import {FontSizeToken} from "./design/typography.js";
import {FontFamilyToken } from "./design/typography.js";
import {LineHeightToken} from "./design/typography.js";
import {LetterSpacingToken} from "./design/typography.js";

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

    public toAst(cst: CstNode): any {
        // Extract the `Property` token
        const propertyNode = cst.children.Property[0];
        // Access `ColonModifier` tokens instead of `Modifier`
        const modifierNodes = cst.children.ColonModifier || [];
        // Access Original User Input
        const inputNode = (cst as any).class;
    
        // Type guard to ensure these are tokens, not nested CST nodes
        if (propertyNode && "image" in propertyNode) {
            return {
                type: "Stateless Class",
                class:inputNode,
                property: (propertyNode as IToken).image,
                modifiers: modifierNodes
                    .filter((modifier): modifier is IToken => "image" in modifier) // Type guard to keep only IToken elements
                    .map((modifier) => modifier.image.replace(":", "")) // Remove the leading colon from each modifier's image
            };
        } else {
            throw new Error("Expected tokens for Property and ColonModifier, but found something else.");
        }
    }
    

    // Parse method to return the CST from the main rule
    public parse(inputTokens: any, className: string): CstNode | undefined {
        this.input = inputTokens;
        const cst = this.propertyDefinition(); // Parse the main rule
        if (this.errors.length > 0) {
            console.error("Parsing errors detected:", this.errors);
            return undefined;
        }
        (cst as any).class = className;
        return cst;
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

    // Parse and get the CST
    const cst = parser.parse(result.tokens,className);
    console.log("", JSON.stringify(cst, null, 2));
  
    if (!cst) {
        console.error("Failed to parse input. Parsing errors:", parser.errors);
        return;
    }

    //Convert CST to AST
    const ast = parser.toAst(cst)

    // Output the AST
    console.log("", JSON.stringify(ast, null, 2));
};

