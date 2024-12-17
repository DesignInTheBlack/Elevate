
//Design System Token Imports Defined in 'Design' Directory.

import { example } from "../design/example.js";
import { colors } from "../design/colors.js";
import { spacing } from "../design/spacing.js";
import { typography } from "../design/typography.js";

//Elevate Utility Tokens
import { numeric } from '../etc/numeric.js';

//Token Type Definitions
export const designSystem = {
    ColorToken: { ...colors, ...example },
    SpacingToken: spacing,
    FontSizeToken: typography.size,
    FontFamilyToken: typography.family,
    LineHeightToken: typography.leading,
    LetterSpacingToken: typography.tracking,
    FontWeightToken: typography.weight,

    //System Tokens
    NumericToken: numeric.NumericToken,
};