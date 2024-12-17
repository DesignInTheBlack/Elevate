// import { SpacingToken } from '../design/spacing.js';
//export type FlexBasisToken = `basis-${SpacingToken}`;
//Consider this approach for listing applicable values for token specific instances

export const flex = {
  xAxis: {
      "x-start": "flex-start",
      "x-end": "flex-end",
      "x-center": "center",
      "x-between": "space-between",
      "x-around": "space-around",
      "x-evenly": "space-evenly",
      "x-stretch": "stretch",
      "x-baseline": "baseline"
  },
  
  yAxis: {
      "y-start": "flex-start",
      "y-end": "flex-end",
      "y-center": "center",
      "y-between": "space-between",
      "y-around": "space-around",
      "y-evenly": "space-evenly",
      "y-stretch": "stretch",
      "y-baseline": "baseline"
  },

  flexGrowRule: {
      "g-0": "0",
      "g-1": "1",
      "g-auto": "auto"
  },

  flexShrinkRule: {
      "s-0": "0",
      "s-1": "1"
  },

  flexSelfRule: {
      "self-start": "flex-start",
      "self-end": "flex-end",
      "self-center": "center",
      "self-stretch": "stretch",
      "self-auto": "auto"
  },

  flexOrderRule: {
      "order-first": "-1",
      "order-0": "0",
      "order-1": "1",
      "order-2": "2",
      "order-3": "3",
      "order-last": "999"
  },

  flexBasisRule: {
      "basis-": "SpacingToken"
  },

 flexWrapRule: {
     "wrap": "wrap",
     "nowrap": "nowrap",
     "reverse": "wrap-reverse"
 }

} as const;

export type FlexRules = keyof typeof flex;
export type FlexGrowRule = keyof typeof flex.flexGrowRule;
export type FlexWrapRule = keyof typeof flex.flexWrapRule;
export type FlexShrinkRule = keyof typeof flex.flexShrinkRule;
export type FlexSelfRule = keyof typeof flex.flexSelfRule;
export type FlexOrderRule = keyof typeof flex.flexOrderRule;
export type FlexBasisRule = keyof typeof flex.flexBasisRule;


