import { relationships } from "../../config/syntax.js";

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
    // Float & Clear
    // =============================
    float: { "float": "FloatRule" },
    clear: { "clear": "ClearRule" },

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
    mg: {
        "margin-top": "top",
        "margin-left": "left",
        "margin-right": "right",
        "margin-bottom": "bottom"
    },

    'mg-y': { "margin-top": "top", 
        "margin-bottom": "bottom" },

    'mg-x': { "margin-left": "left", 
        "margin-right": "right" },

    pd: {
        "padding-top": "top",
        "padding-left": "left",
        "padding-right": "right",
        "padding-bottom": "bottom"
    },

    'pd-y': { "padding-top": "top", 
        "padding-bottom": "bottom" },

    'pd-x': { "padding-left": "left", 
        "padding-right": "right" },

    'pd-l': { "padding-left": "SpacingToken" },
    'pd-r': { "padding-right": "SpacingToken" },
    'pd-t': { "padding-top": "SpacingToken" },
    'pd-b': { "padding-bottom": "SpacingToken" },
    'mg-l': { "margin-left": "SpacingToken" },
    'mg-r': { "margin-right": "SpacingToken" },
    'mg-t': { "margin-top": "SpacingToken" },
    'mg-b': { "margin-bottom": "SpacingToken" },

    // =============================
    // Logical Spacing
    // =============================
    'margin-inline': { "margin-inline": "SpacingToken" },
    'margin-inline-start': { "margin-inline-start": "SpacingToken" },
    'margin-inline-end': { "margin-inline-end": "SpacingToken" },
    'margin-block': { "margin-block": "SpacingToken" },
    'margin-block-start': { "margin-block-start": "SpacingToken" },
    'margin-block-end': { "margin-block-end": "SpacingToken" },
    'padding-inline': { "padding-inline": "SpacingToken" },
    'padding-inline-start': { "padding-inline-start": "SpacingToken" },
    'padding-inline-end': { "padding-inline-end": "SpacingToken" },
    'padding-block': { "padding-block": "SpacingToken" },
    'padding-block-start': { "padding-block-start": "SpacingToken" },
    'padding-block-end': { "padding-block-end": "SpacingToken" },
    'inset-inline': { "inset-inline": "SpacingToken" },
    'inset-inline-start': { "inset-inline-start": "SpacingToken" },
    'inset-inline-end': { "inset-inline-end": "SpacingToken" },
    'inset-block': { "inset-block": "SpacingToken" },
    'inset-block-start': { "inset-block-start": "SpacingToken" },
    'inset-block-end': { "inset-block-end": "SpacingToken" },

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

    'row-r': {
        "align-items": "x",   // x maps to align-items in col
        "justify-content": "y", // y maps to justify-content in col
        "flex-wrap": "FlexWrapRule"
    },

    'col-r': {
        "align-items": "x",   // x maps to align-items in col
        "justify-content": "y", // y maps to justify-content in col
        "flex-wrap": "FlexWrapRule"
    },

    child: {
        "flex-basis": "FlexBasisRule",
        "flex-grow": "FlexGrowRule",
        "flex-shrink": "FlexShrinkRule",
        "align-self": "FlexSelfRule",
        "order": "FlexOrderRule"
    },

    // =============================
    // Typography
    // =============================
    font: {
        "font-size": "FontSizeToken",
        "font-family": "FontFamilyToken",
        "font-weight": "FontWeightToken",
        "letter-spacing": "LetterSpacingToken",
        
    },

    text: {
        "color": "ColorToken",
        "line-height": "LineHeightToken",
        "max-width": "MeasureToken",
        "text-align": "TextAlignRule",
        "text-decoration": "TextDecorationRule",
    },

    format: {
    "text-transform": "TextTransformRule",
    "hyphens": "HyphensRule",
    "white-space": "WhiteSpaceRule",
    "word-break": "WordBreakRule",
    "overflow-wrap": "OverflowWrapRule"
    },

    'font-style': { "font-style": "FontStyleRule" },
    'font-variant': { "font-variant": "FontVariantRule" },
    'font-stretch': { "font-stretch": "FontStretchRule" },
    'text-indent': { "text-indent": "SpacingToken" },
    'text-overflow': { "text-overflow": "TextOverflowRule" },
    'text-rendering': { "text-rendering": "TextRenderingRule" },
    'word-spacing': { "word-spacing": "SpacingToken" },
    'tab-size': { "tab-size": "NumericToken" },
    'writing-mode': { "writing-mode": "WritingModeRule" },
    'direction': { "direction": "DirectionRule" },
    'unicode-bidi': { "unicode-bidi": "UnicodeBidiRule" },
    'line-clamp': { "line-clamp": "NumericToken" },
    'text-decoration-color': { "text-decoration-color": "ColorToken" },
    'text-decoration-style': { "text-decoration-style": "BorderStyleRule" },
    'text-decoration-thickness': { "text-decoration-thickness": "SpacingToken" },



    // =============================
    // Borders
    // =============================
    bd: {
        "border-color": "ColorToken",
        "border-width": "BorderWidthRule",
        "border-radius": "BorderRadiusRule",
        "border-top-left-radius": "BorderTopLeftRadiusRule",
        "border-top-right-radius": "BorderTopRightRadiusRule",
        "border-bottom-left-radius": "BorderBottomLeftRadiusRule",
        "border-bottom-right-radius": "BorderBottomRightRadiusRule",
        "border-style": "BorderStyleRule"
    },

    'bd-l': {
        "border-left-color": "ColorToken",
        "border-left-width": "BorderWidthRule",
        "border-left-style": "BorderStyleRule"
    },

    'bd-r': {
        "border-right-color": "ColorToken",
        "border-right-width": "BorderWidthRule",
        "border-right-style": "BorderStyleRule"
    },

    'bd-t': {
        "border-top-color": "ColorToken",
        "border-top-width": "BorderWidthRule",
        "border-top-style": "BorderStyleRule"
    },

    'bd-b': {
        "border-bottom-color": "ColorToken",
        "border-bottom-width": "BorderWidthRule",
        "border-bottom-style": "BorderStyleRule"
    },

    'border-x': { "border-inline": "PassThroughToken" },
    'border-y': { "border-block": "PassThroughToken" },
    'border-collapse': { "border-collapse": "BorderCollapseRule" },
    'border-spacing': { "border-spacing": "SpacingToken" },
    'border-image-source': { "border-image-source": "PassThroughToken" },
    'border-image-slice': { "border-image-slice": "PassThroughToken" },
    'border-image-width': { "border-image-width": "PassThroughToken" },
    'border-image-outset': { "border-image-outset": "PassThroughToken" },
    'border-image-repeat': { "border-image-repeat": "PassThroughToken" },

    // =============================
    // Backgrounds
    // =============================
    'bg-img': { "background-image": "PassThroughToken" },
    'bg-color': { 'background-color': "ColorToken" },
    'bg-attr': { "background-size": "BGSizeRule",
        "background-position": "BGPositionRule",
        "background-repeat": "BGRepeatRule",
        "background-attachment": "BackgroundAttachmentRule",
        "background-origin": "BackgroundOriginRule",
        "background-clip": "BackgroundClipRule",
    },
    'bg-exact': { "background-size": "PassThroughToken" },


    // =============================
    // Grid Layout
    // =============================
    grid: {
        "grid-template-columns": "GridColumnRule",
        "grid-template-rows": "GridRowRule",
        "gap": "GridGapRule",
        "column-gap": "GridGapXRule",
        "row-gap": "GridGapYRule"
    },

    'grid-template-areas': { "grid-template-areas": "PassThroughToken" },
    'grid-area': { "grid-area": "PassThroughToken" },
    
     'col-spans': {"grid-column-start":"SpanColumnStartRule",
                  "grid-column-end": "SpanColumnEndRule",
     },

     'row-spans': {"grid-row-start":"SpanRowStartRule",
                  "grid-row-end": "SpanRowEndRule",
     },

     'col-spans-all': {
        "grid-column-start": "1", /* Start at the first column */
        "grid-column-end": "-1"  /* End at the last column */
     },

     'row-spans-all': {
        "grid-row-start": "1", /* Start at the first row */
        "grid-row-end": "-1"  /* End at the last row */
     },

     'auto-col':{'grid-auto-columns': "PassThroughToken"},
     'auto-row':{'grid-auto-rows': "PassThroughToken"},
     'auto-flow':{'grid-auto-flow': "PassThroughToken"},


     'content':{
                'align-content': "AlignContentRule",
                'justify-content': "JustifyContentRule"
     },

     'items':{
                'align-items': "AlignItemsRule",
                'justify-items': "JustifyItemsRule",  
     },

    'align-self': { "align-self": "AlignItemsRule" },
    'justify-self': { "justify-self": "JustifyItemsRule" },
    'place-self': { "place-self": "PlaceRule" },
    place: { "place-content": "PlaceRule" },


    //To be documented

    // =============================
    // Layout Affordances
    // =============================
    stack: {
        "gap": "GridGapRule",
        "align-items": "AlignItemsRule",
        "justify-content": "JustifyContentRule",
        "flex-direction": "StackDirectionRule"
    },

    cluster: {
        "gap": "GridGapRule",
        "align-items": "AlignItemsRule",
        "justify-content": "JustifyContentRule",
        "flex-wrap": "FlexWrapRule"
    },

    split: {
        "grid-template-columns": "SplitRatioRule",
        "gap": "GridGapRule"
    },

    center: {
        "max-width": "AffordanceMaxRule",
        "text-align": "CenterTextRule"
    },

    'grid-auto': {},

    // =============================
    // Cursor
    // =============================
    'cursor': { "cursor": "CursorRule" },

    // =============================
    // Aspect Ratios
    // =============================

    'aspect': { "aspect-ratio": "AspectRule" },

     // =============================
    // Aspect Ratios
    // =============================
     'content-box': { "box-sizing": "content-box" },
     'border-box': { "box-sizing": "border-box" },
     'box-decoration-break': { "box-decoration-break": "BoxDecorationRule" },

    // =============================
    // Overflow
    // =============================
    'overflow': { "overflow": "OverflowRule" },
    'overflow-x': { "overflow-x": "OverflowRule" },
    'overflow-y': { "overflow-y": "OverflowRule" },
    'overscroll': { "overscroll-behavior": "OverscrollRule" },
    'overscroll-x': { "overscroll-behavior-x": "OverscrollRule" },
    'overscroll-y': { "overscroll-behavior-y": "OverscrollRule" },
    'scroll-behavior': { "scroll-behavior": "ScrollBehaviorRule" },
    'scroll-snap-type': { "scroll-snap-type": "ScrollSnapTypeRule" },
    'scroll-snap-align': { "scroll-snap-align": "ScrollSnapAlignRule" },
    'scroll-margin': { "scroll-margin": "SpacingToken" },
    'scroll-padding': { "scroll-padding": "SpacingToken" },
    'scrollbar-width': { "scrollbar-width": "ScrollbarWidthRule" },
    'scrollbar-color': { "scrollbar-color": "PassThroughToken" },
    'scrollbar-gutter': { "scrollbar-gutter": "ScrollbarGutterRule" },

    // =============================
    // Content Visibility
    // =============================
    'content-visibility': { "content-visibility": "ContentVisibilityRule" },

    // =============================
    // Visibility
    // =============================
    'visible': { "visibility": "visible" },
    'invisible': { "visibility": "hidden" },
    'collapse': { "visibility": "collapse" },

    // =============================
    // Lists & Tables
    // =============================
    'list-style-type': { "list-style-type": "ListStyleTypeRule" },
    'list-style-position': { "list-style-position": "ListStylePositionRule" },
    'list-style-image': { "list-style-image": "PassThroughToken" },
    'table-layout': { "table-layout": "TableLayoutRule" },
    'caption-side': { "caption-side": "CaptionSideRule" },

    
    // =============================
    // Place Content
    // =============================

    'place-content': { "place-content": "PlaceRule" },


    // =============================
    // Pointer Events
    // =============================

    'events': { "pointer-events": "PointerEventsRule" },

    // =============================
    // Caret Color
    // =============================

    caret: { "caret-color": "ColorToken" },
    
    // =============================
    // Resize
    // =============================

    'resize': { "resize": "ResizeRule" },

    // =============================
    // Vertical Alignment
    // =============================

    'vertical': { "vertical-align": "VerticalRule" },

    // =============================
    // Outline
    // =============================

    outline: {
        "outline-color": "ColorToken",
        "outline-width": "SpacingToken",
        "outline-style": "BorderStyleRule",
        "outline-offset": "OffsetRule",
        "border-radius": "RoundRule",
    },

    // =============================
    // Shadow
    // =============================

    'shadow': { "box-shadow": "ShadowToken",
                "text-shadow": "TextShadowToken"
     },

     // =============================
    // Gradient
    // =============================

    'gradient': { "background": "GradientToken" },

    // =============================
    // Transition
    // =============================

    'transition': { "transition": "TransitionToken" },
    'animation': { "animation": "PassThroughToken" },
    'animation-name': { "animation-name": "PassThroughToken" },
    'animation-duration': { "animation-duration": "PassThroughToken" },
    'animation-timing-function': { "animation-timing-function": "PassThroughToken" },
    'animation-delay': { "animation-delay": "PassThroughToken" },
    'animation-iteration-count': { "animation-iteration-count": "PassThroughToken" },
    'animation-direction': { "animation-direction": "AnimationDirectionRule" },
    'animation-fill-mode': { "animation-fill-mode": "AnimationFillRule" },
    'animation-play-state': { "animation-play-state": "AnimationPlayRule" },

    // =============================
    // Patterns
    // =============================

    'pattern': { "background": "PatternToken",
                "background-color": "PatternBackRule",
                "color": "PatternForeRule",
     },

     'contain':{},
     
    // =============================
    // Opacity
    // =============================

    'opacity': { "opacity": "NumericToken" },

    // =============================
    // Object Position
    // =============================

    'fit': { "object-fit": "ObjectFitRule" },
    'object-position': { "object-position": "PassThroughToken" },

    // =============================
    // SVG & Media
    // =============================
    'fill': { "fill": "ColorToken" },
    'stroke': { "stroke": "ColorToken" },
    'stroke-width': { "stroke-width": "SpacingToken" },

    // =============================
    // Allow Empty Pseudo-Elements
    // =============================

    'empty':{"content": "''"},

    // =============================
    // Select
    // =============================

    'select': { "user-select": "SelectRule" },

    // =============================
    // Form & UI
    // =============================

    'appearance': { "appearance": "AppearanceRule" },
    'accent': { "accent-color": "ColorToken" },
    

   // =============================
   //Transform & Filters
    // =============================
    'origin': { "transform-origin": "PassThroughToken" },
    'transform': { "transform": "PassThroughToken" },
    'filter': { "filter": "PassThroughToken" },
    'translate': { "translate": "PassThroughToken" },
    'scale': { "scale": "PassThroughToken" },
    'rotate': { "rotate": "PassThroughToken" },
    'skew': { "transform": "PassThroughToken" },
    'backdrop-filter': { "backdrop-filter": "PassThroughToken" },
    'mix-blend-mode': { "mix-blend-mode": "BlendModeRule" },
    'background-blend-mode': { "background-blend-mode": "BlendModeRule" },
    'isolation': { "isolation": "IsolationRule" },

    // =============================
    // Allow User Overrides and Extensions
    // =============================

    ...relationships

};
