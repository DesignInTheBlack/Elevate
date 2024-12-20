
//Rule Submap Imports Defined in 'Maps' Directory.
import { flex } from '../rules/flex.js';
import { border } from '../rules/border.js';
import { text } from '../rules/text.js';
import { grid } from '../rules/grid.js';
import { breakpoints } from '../design/breakpoints.js';

//Token Type Definitions
export const rulesMaster = {
    TextAlignRule: text.align,
    TextTransformRule: text.transform,
    BreakPointToken: breakpoints,
    xAxis: flex.xAxis,
    yAxis: flex.yAxis,
    BorderWidthRule: border.width,
    BorderRadiusRule: border.radius,
    BorderStyleRule: border.style,
    FlexGrowRule: flex.Grow,
    FlexShrinkRule: flex.Shrink,
    FlexSelfRule: flex.Self,
    FlexOrderRule: flex.Order,
    FlexBasisRule: flex.Basis,
    GridGapRule: grid.gap,
    GridRowRule: grid.row,
    GridColumnRule: grid.column
};