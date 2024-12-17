import { SpacingToken } from '../design/spacing.js';
import { NumericToken } from '../etc/numeric.js';

export const grid = {
 gap: {
  "gap-": "SpacingToken", // This looks correct
 },

 row: {
  "row-": "NumericToken", // Changed from NumberToken
 },

 column: {
  "col-": "NumericToken" // Changed from NumberToken
 }
} as const;

export type GridRules = keyof typeof grid;
export type GridGapRule = `g-${SpacingToken}`; // This looks correct
export type GridRowRule = `r-${NumericToken}`; // More flexible numeric typing
export type GridColumnRule = `c-${NumericToken}`; // More flexible numeric typing