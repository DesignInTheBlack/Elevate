
//Rule Submap Imports Defined in 'Maps' Directory.
import { flex } from './rules/flex.js';
import { border } from './rules/border.js';
import { text } from './rules/text.js';
import { grid } from './rules/grid.js';
import { backgrounds} from './rules/backgrounds.js';
import { cursor } from './rules/cursor.js';
import { aspect } from './rules/aspect.js';
import { overflow } from './rules/overflow.js';
import { overscroll } from './rules/overscroll.js';
import { scrollbehavior } from './rules/scrollbehavior.js';
import { scrollsnap } from './rules/scrollsnap.js';
import { place } from './rules/place.js';
import { decoration } from './rules/decoration.js'; 
import { whitespace } from './rules/whitespace.js';
import { wordbreak } from './rules/wordbreak.js';
import { pointerevents } from './rules/pointerevents.js';
import { resize } from './rules/resize.js';
import { vertical } from './rules/vertical.js';
import { hyphens } from './rules/hyphens.js';
import { attachment } from './rules/attachment.js';
import { clip } from './rules/clip.js';
import { origin } from './rules/origin.js';
import { outline } from './rules/outline.js';
import { pattern } from './rules/pattern.js';
import { span } from './rules/span.js';
import { object } from './rules/object.js';
import { overflowwrap } from './rules/overflowwrap.js';
import { justc } from './rules/justifycontent.js';
import { aligni } from './rules/alignitems.js';
import { alignc } from './rules/aligncontent.js';
import { justi } from './rules/justifyitems.js';
import { select } from './rules/select.js';
import { appearance } from './rules/appearance.js';
import { float } from './rules/float.js';
import { clear } from './rules/clear.js';
import { contentvisibility } from './rules/contentvisibility.js';
import { scrollbar } from './rules/scrollbar.js';
import { typography } from './rules/typography.js';
import { boxdecoration } from './rules/boxdecoration.js';
import { blendmode } from './rules/blendmode.js';
import { isolation } from './rules/isolation.js';
import { animation } from './rules/animation.js';
import { table } from './rules/table.js';
import { liststyle } from './rules/liststyle.js';
import { affordances } from './rules/affordances.js';

//Token Type Definitions
export const elevateRules = {
    JustifyContentRule: justc.options,
    AlignItemsRule: aligni.options,
    AlignContentRule: alignc.options,
    JustifyItemsRule: justi.options,
    TextAlignRule: text.align,
    TextTransformRule: text.transform,
    xAxis: flex.xAxis,
    yAxis: flex.yAxis,
    BorderWidthRule: border.width,
    BorderRadiusRule: border.radius,
    BorderTopLeftRadiusRule: border.topLeftRadius,
    BorderTopRightRadiusRule: border.topRightRadius,
    BorderBottomLeftRadiusRule: border.bottomLeftRadius,
    BorderBottomRightRadiusRule: border.bottomRightRadius,
    BorderStyleRule: border.style,
    FlexGrowRule: flex.Grow,
    FlexShrinkRule: flex.Shrink,
    FlexSelfRule: flex.Self,
    FlexOrderRule: flex.Order,
    FlexBasisRule: flex.Basis,
    FlexWrapRule: flex.Wrap,
    GridGapRule: grid.gap,
    GridRowRule: grid.row,
    GridColumnRule: grid.column,
    BGSizeRule: backgrounds.size,
    BGRepeatRule: backgrounds.repeat,
    BGPositionRule: backgrounds.position,
    CursorRule: cursor.variety,
    AspectRule: aspect.ratios,
    OverflowRule: overflow.options,
    OverscrollRule: overscroll.options,
    ScrollBehaviorRule: scrollbehavior.options,
    ScrollSnapTypeRule: scrollsnap.type,
    ScrollSnapAlignRule: scrollsnap.align,
    PlaceRule: place.content,
    TextDecorationRule: decoration.options,
    WhiteSpaceRule: whitespace.options,
    WordBreakRule: wordbreak.options,
    PointerEventsRule: pointerevents.options,
    ResizeRule: resize.options,
    VerticalRule: vertical.options,
    HyphensRule: hyphens.options,
    BackgroundAttachmentRule: attachment.options,
    BackgroundClipRule: clip.options,
    BackgroundOriginRule: origin.options,
    OffsetRule: outline.offset,
    RoundRule: outline.radius,
    PatternForeRule: pattern.foreground,
    PatternBackRule: pattern.background,
    SpanColumnStartRule: span.columnstart,
    SpanColumnEndRule: span.columnend,
    SpanRowStartRule: span.rowstart,
    SpanRowEndRule: span.rowend,
    GridGapXRule: grid.columngap,
    GridGapYRule: grid.rowgap,
    ObjectFitRule: object.options,
    OverflowWrapRule: overflowwrap.options,
    SelectRule: select.options,
    AppearanceRule: appearance.options,
    FloatRule: float.options,
    ClearRule: clear.options,
    ContentVisibilityRule: contentvisibility.options,
    ScrollbarWidthRule: scrollbar.width,
    ScrollbarGutterRule: scrollbar.gutter,
    FontStyleRule: typography.fontStyle,
    FontVariantRule: typography.fontVariant,
    FontStretchRule: typography.fontStretch,
    TextOverflowRule: typography.textOverflow,
    TextRenderingRule: typography.textRendering,
    WritingModeRule: typography.writingMode,
    DirectionRule: typography.direction,
    UnicodeBidiRule: typography.unicodeBidi,
    BoxDecorationRule: boxdecoration.options,
    BlendModeRule: blendmode.options,
    IsolationRule: isolation.options,
    AnimationDirectionRule: animation.direction,
    AnimationFillRule: animation.fill,
    AnimationPlayRule: animation.play,
    TableLayoutRule: table.layout,
    CaptionSideRule: table.captionSide,
    BorderCollapseRule: table.borderCollapse,
    ListStyleTypeRule: liststyle.type,
    ListStylePositionRule: liststyle.position,
    SplitRatioRule: affordances.splitRatio,
    StackDirectionRule: affordances.stackDirection,
    CenterTextRule: affordances.centerText,
    AffordanceMaxRule: affordances.max,
    GridAutoMinRule: affordances.min,
};
