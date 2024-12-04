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

    // Position
    inset: {
        "top": "SpacingToken",
        "right": "SpacingToken",
        "bottom": "SpacingToken",
        "left": "SpacingToken"
    },

    // Flex Properties
    row: {
        "justify-content": "RowMainToken",
        "align-items": "RowCrossToken",
    },

    stack: {
        "justify-content": "ColMainToken",
        "align-items": "ColCrossToken",
    },

    item: {
        "basis": "FlexBasisToken",
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