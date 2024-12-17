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

export type BorderToken = keyof typeof border;
export type BorderWidthToken = `w-${SpacingToken}`;
export type BorderRadiusToken = `r-${SpacingToken}`;
export type BorderStyleToken = keyof typeof border.style;

// import { SpacingToken } from '../design/spacing.js';
//export type FlexBasisToken = `basis-${SpacingToken}`;