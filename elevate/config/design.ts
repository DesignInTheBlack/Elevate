//Design System Token Imports 

//Example Custom Values Import
import { BrandColors } from "../design/example-brandTokens.js";

//System Standard Imports
import { colors } from "../core/system/design/colors.js";
import { spacing } from "../core/system/design/spacing.js";
import { typography } from "../core/system/design/typography.js";
import { breakpoints } from '../core/system/design/breakpoints.js';

//Token Definitions
export const designSystem = {
    ColorToken: colors,
    BreakPointToken: breakpoints,
    SpacingToken: spacing,
    FontSizeToken: typography.size,
    FontFamilyToken: typography.family,
    LineHeightToken: typography.leading,
    LetterSpacingToken: typography.tracking,
    FontWeightToken: typography.weight,
    ...BrandColors
};