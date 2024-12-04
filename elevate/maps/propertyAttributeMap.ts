export const propertyAttributeMap = {
    // Spacing & Layout
    m: {
        "margin-left": "left",
        "margin-right": "right",
        "margin-top": "top",
        "margin-bottom": "bottom"
    },

    p: {
        "padding-left": "left",
        "padding-right": "right",
        "padding-top": "top",
        "padding-bottom": "bottom"
    },

    w: {
        "width": "SpacingToken"
    },

    h: {
        "height": "SpacingToken"
    },

    min: {
        "min-width": "SpacingToken",
        "min-height": "SpacingToken"
    },

    max: {
        "max-width": "SpacingToken",
        "max-height": "SpacingToken"
    },

    gap: {
        "gap": "SpacingToken"
    },

    // Need to break this into display token types?
    display: {
        "block": "display:block;",
        "inline-block": "display: inline-block;",
        "inline": "display: inline;",
        "flex": "display: flex;",
        "inline-flex": "display: inline-flex;",
        "table": "display: table;",
        "inline-table": "display: inline-table;",
        "table-caption": "display: table-caption;",
        "table-cell": "display: table-cell;",
        "table-column": "display: table-column;",
        "table-column-group": "display: table-column-group;",
        "table-footer-group": "display: table-footer-group;",
        "table-header-group": "display: table-header-group;",
        "table-row-group": "display: table-row-group;",
        "table-row": "display: table-row;",
        "flow-root": "display: flow-root;",
        "grid": "display: grid;",
        "inline-grid": "display: inline-grid;",
        "contents": "display: contents;",
        "list-item": "display: list-item;",
        "hidden": "display: none;"
    },


    inset: {
        "top": "top",
        "right": "right",
        "bottom": "bottom",
        "left": "left"
    },
    
    left:{"left":"SpacingToken"},
    right:{"right":"SpacingToken"},
    top:{"top":"SpacingToken"},
    bottom:{"bottom":"SpacingToken"},

    // Flex Properties
    row: {
        "justify-content": "x",  // x maps to justify-content in row
        "align-items": "y"       // y maps to align-items in row
    },
    
    stack: {
        "align-items": "x",      // x maps to align-items in stack 
        "justify-content": "y"   // y maps to justify-content in stack
    },

    item: {
        "flex-basis": "FlexBasisToken",
        "flex-grow": "FlexGrowToken",
        "flex-shrink": "FlexShrinkToken",
        "align-self": "FlexSelfToken",
        "order": "FlexOrderToken"
    },

    // Typography
    text: {
        "font-size": "FontSizeToken",
        "color": "ColorToken",
        "font-family": "FontFamilyToken",
        "line-height": "LineHeightToken",
        "letter-spacing": "LetterSpacingToken",
        "text-align": "TextAlignToken",
        "max-width": "MeasureToken",
        "font-weight": "FontWeightToken"
    },

    // Background
    color: {
        "background-color": "ColorToken"
    },


    border: {
        "border-color": "ColorToken",
        "border-width": "BorderWidthToken",
        "border-radius": "BorderRadiusToken",
        "outline-width": "BorderWidthToken",
        "border-style": "BorderStyleToken",
    }
} as const;

export type propertyMap = keyof typeof propertyAttributeMap;
export const propertyKeys = Object.keys(propertyAttributeMap) as propertyMap[];