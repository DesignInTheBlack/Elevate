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
const Modifier = createToken({ name: "Modifier", pattern: /[a-zA-Z0-9]+/ });
const Colon = createToken({ name: "Colon", pattern: /:/ });

// Combine Tokens into Vocabulary
const tokens = [Property, Colon, Modifier];

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
                $.CONSUME(Colon);
                $.CONSUME(Modifier);
        });
        });

        // Perform self-analysis to initialize the parser
        this.performSelfAnalysis();
    }

   // Convert CST to AST
   public toAst(cst: CstNode): any {
    // Extract the `Property` and `Modifier` nodes
    const propertyNode = cst.children.Property[0];
    const modifierNode = cst.children.Modifier[0];

    // Type guard to ensure these are tokens, not nested CST nodes
    if (propertyNode && "image" in propertyNode) {
        return {
            type: "Class Utility",
            property: (propertyNode as IToken).image, // Cast propertyNode to IToken to access .image
            modifier: (modifierNode as IToken).image  // Cast modifierNode to IToken to access .image
        };
    } else {
        throw new Error("Expected tokens for Property and Modifier, but found something else.");
    }
}

    // Parse method to return the CST from the main rule
    public parse(inputTokens: any): CstNode | undefined {
        this.input = inputTokens;
        const cst = this.propertyDefinition(); // Parse the main rule
        if (this.errors.length > 0) {
            console.error("Parsing errors detected:", this.errors);
            return undefined;
        }
        return cst;
    }
}

// The compiler function
export const elevateCompiler = (input: string): void => {
    const parser = new ElevateParser();
    const result = lexer.tokenize(input);

    // Check for lexing errors
    if (result.errors.length > 0) {
        console.error("Lexing errors detected:", result.errors);
        return;
    }

    // Parse and get the CST
    const cst = parser.parse(result.tokens);

    if (!cst) {
        console.error("Failed to parse input. Parsing errors:", parser.errors);
        return;
    }

    //Convert CST to AST
    const ast = parser.toAst(cst)

    // Output the CST
    console.log("", JSON.stringify(ast, null, 2));
};

