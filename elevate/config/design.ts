
//Design System Token Imports 

//Example Token Import
import { example } from "../design/example.js";

//System Standard Imports
import { colors } from "../design/colors.js";
import { spacing } from "../design/spacing.js";
import { typography } from "../design/typography.js";
import { breakpoints } from '../design/breakpoints.js';

//Token Definitions
export const designSystem = {
    ColorToken: { ...colors, ...example },
    BreakPointToken: breakpoints,
    SpacingToken: spacing,
    FontSizeToken: typography.size,
    FontFamilyToken: typography.family,
    LineHeightToken: typography.leading,
    LetterSpacingToken: typography.tracking,
    FontWeightToken: typography.weight,
};