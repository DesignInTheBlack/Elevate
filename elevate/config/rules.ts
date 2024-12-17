
//Rule Submap Imports Defined in 'Maps' Directory.
import { flex } from '../rules/flex.js';
import { border } from '../rules/border.js';
import { text } from '../rules/text.js';
import { grid } from '../rules/grid.js';
import { numeric } from '../rules/numeric.js';
import { breakpoints } from '../design/breakpoints.js';

//Token Type Definitions
export const rulesMaster = {
    TextAlignToken: text.align,
    TextTransformToken: text.transform,
    BreakPointToken: breakpoints,
    xAxis: flex.xAxis,
    yAxis: flex.yAxis,
    BorderWidthToken: border.width,
    BorderRadiusToken: border.radius,
    BorderStyleToken: border.style,
    FlexGrowToken: flex.flexGrowToken,
    FlexShrinkToken: flex.flexShrinkToken,
    FlexSelfToken: flex.flexSelfToken,
    FlexOrderToken: flex.flexOrderToken,
    FlexBasisToken: flex.flexBasisToken,
    NumericToken: numeric.NumericToken,
    GridGapToken: grid.gap,
    GridRowToken: grid.row,
    GridColumnToken: grid.column
};