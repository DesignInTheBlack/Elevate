import { SpacingToken } from '../design/spacing.js';
import { NumericToken } from '../maps/numeric.js';

export const grid = {
 gap: {
  "g-": "SpacingToken", // This looks correct
 },

 row: {
  "r-": "NumericToken", // Changed from NumberToken
 },

 column: {
  "c-": "NumericToken" // Changed from NumberToken
 }
} as const;

export type GridToken = keyof typeof grid;
export type GridGapToken = `g-${SpacingToken}`; // This looks correct
export type GridRowToken = `r-${NumericToken}`; // More flexible numeric typing
export type GridColumnToken = `c-${NumericToken}`; // More flexible numeric typing