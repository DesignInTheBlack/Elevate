import { SpacingToken } from '../design/spacing.js';

export const border = {
    width: {
        "w-": "SpacingToken"
    },
    radius: {
        "r-": "SpacingToken"
    },
    style: {
        "solid": "solid",
        "dashed": "dashed",
        "dotted": "dotted",
        "double": "double",
        "groove": "groove",
        "ridge": "ridge",
        "inset": "inset",
        "outset": "outset",
        "none": "none",
        "hidden": "hidden"
    }
} as const;

export type BorderRules = keyof typeof border;
export type BorderWidthRule = `w-${SpacingToken}`;
export type BorderRadiusRule = `r-${SpacingToken}`;
export type BorderStyleRule = keyof typeof border.style;
