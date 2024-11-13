// buffer.ts
import { type SpacingToken } from './spacing.js';
import { type BreakpointToken } from './breakpoints.js';

export const buffer: Record<BreakpointToken, SpacingToken> = {
    '2xs': 'd5',
    'xs': 'd5',
    'sm': 'd5',
    'md': 'd8',
    'lg': 'd8',
    'xl': 'd8',
    '2xl': 'd8',
    '3xl': 'c12',
    '4xl': 'c12',
    '5xl': 'c12'
};

export type BufferToken = typeof buffer;