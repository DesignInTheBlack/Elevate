import { SpacingToken } from '../design/spacing.js';

export const border = {
    width: {
        "w-": "SpacingToken"
    },
    radius: {
        "r-": "SpacingToken"
    },
    style: {
        "s-": "PassThrough"     // Just passes through the value (solid, dashed, etc)
    }
} as const;

export type BorderToken = keyof typeof border;
export type BorderWidthToken = keyof typeof border.width;
export type BorderRadiusToken = `r-${SpacingToken}`;
export type BorderStyleToken = keyof typeof border.style;

// import { SpacingToken } from '../design/spacing.js';
//export type FlexBasisToken = `basis-${SpacingToken}`;