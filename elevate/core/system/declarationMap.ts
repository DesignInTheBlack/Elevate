import { relationships } from "../../config/rules.js";

export const declarationMap = {

    // =============================
    // Positioning
    // =============================
    relative: { "position": "relative" },
    absolute: { "position": "absolute" },
    fixed: { "position": "fixed" },
    sticky: { "position": "sticky" },
    static: { "position": "static" },
    initial: { "position": "initial" },
    inherit: { "position": "inherit" },

    // =============================
    // Display Properties
    // =============================
    block: { "display": "block" },
    "inline-block": { "display": "inline-block" },
    inline: { "display": "inline" },
    flex: { "display": "flex" },
    "inline-flex": { "display": "inline-flex" },
    table: { "display": "table" },
    "inline-table": { "display": "inline-table" },
    "table-caption": { "display": "table-caption" },
    "table-cell": { "display": "table-cell" },
    "table-column": { "display": "table-column" },
    "table-column-group": { "display": "table-column-group" },
    "table-footer-group": { "display": "table-footer-group" },
    "table-header-group": { "display": "table-header-group" },
    "table-row-group": { "display": "table-row-group" },
    "table-row": { "display": "table-row" },
    "flow-root": { "display": "flow-root" },
    "inline-grid": { "display": "inline-grid" },
    contents: { "display": "contents" },
    "list-item": { "display": "list-item" },
    hidden: { "display": "none" },

    // =============================
    // Z-Index
    // =============================
    z: { "z-index": "NumericToken" },

    // =============================
    // Spacing & Layout
    // =============================
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

    pl: { "padding-left": "SpacingToken" },
    pr: { "padding-right": "SpacingToken" },
    pt: { "padding-top": "SpacingToken" },
    pb: { "padding-bottom": "SpacingToken" },
    ml: { "margin-left": "SpacingToken" },
    mr: { "margin-right": "SpacingToken" },
    mt: { "margin-top": "SpacingToken" },
    mb: { "margin-bottom": "SpacingToken" },
    w: { "width": "SpacingToken" },
    h: { "height": "SpacingToken" },
    'min-w': { "min-width": "SpacingToken" },
    'max-w': { "max-width": "SpacingToken" },
    'min-h': { "min-height": "SpacingToken" },
    'max-h': { "max-height": "SpacingToken" },
    gap: { "gap": "SpacingToken" },

    inset: {
        "top": "top",
        "right": "right",
        "bottom": "bottom",
        "left": "left"
    },

    left: { "left": "SpacingToken" },
    right: { "right": "SpacingToken" },
    top: { "top": "SpacingToken" },
    bottom: { "bottom": "SpacingToken" },

    // =============================
    // Flex Properties
    // =============================
    row: {
        "justify-content": "x", // x maps to justify-content in row
        "align-items": "y",    // y maps to align-items in row
        "flex-wrap": "FlexWrapRule"
    },

    col: {
        "align-items": "x",   // x maps to align-items in col
        "justify-content": "y", // y maps to justify-content in col
        "flex-wrap": "FlexWrapRule"
    },

    item: {
        "flex-basis": "FlexBasisRule",
        "flex-grow": "FlexGrowRule",
        "flex-shrink": "FlexShrinkRule",
        "align-self": "FlexSelfRule",
        "order": "FlexOrderRule"
    },

    // =============================
    // Typography
    // =============================
    text: {
        "font-size": "FontSizeToken",
        "color": "ColorToken",
        "font-family": "FontFamilyToken",
        "line-height": "LineHeightToken",
        "letter-spacing": "LetterSpacingToken",
        "text-align": "TextAlignRule",
        "max-width": "MeasureToken",
        "font-weight": "FontWeightToken",
        "text-transform": "TextTransformRule"
    },

    // =============================
    // Borders
    // =============================
    border: {
        "border-color": "ColorToken",
        "border-width": "BorderWidthRule",
        "border-radius": "BorderRadiusRule",
        "outline-width": "BorderWidthRule",
        "border-style": "BorderStyleRule"
    },

    // =============================
    // Backgrounds
    // =============================
    'bg-img': { "background-image": "PassThroughToken" },
    'bg-color': { 'background-color': "ColorToken" },

    // =============================
    // Grid Layout
    // =============================
    grid: {
        "grid-template-columns": "GridColumnRule",
        "grid-template-rows": "GridRowRule",
        "grid-gap": "GridGapRule"
    },



    // Allow User Overrides and Extensions
    ...relationships

};
