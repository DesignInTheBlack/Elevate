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

  // These remain unchanged
  flexGrowToken: {
      "g-0": "0",
      "g-1": "1",
      "g-auto": "auto"
  },

  flexShrinkToken: {
      "s-0": "0",
      "s-1": "1"
  },

  flexSelfToken: {
      "self-start": "flex-start",
      "self-end": "flex-end",
      "self-center": "center",
      "self-stretch": "stretch",
      "self-auto": "auto"
  },

  flexOrderToken: {
      "order-first": "-1",
      "order-0": "0",
      "order-1": "1",
      "order-2": "2",
      "order-3": "3",
      "order-last": "999"
  },

  flexBasisToken: {
      "basis-": "SpacingToken"
  }
} as const;

export type FlexToken = keyof typeof flex;
export type FlexGrowToken = keyof typeof flex.flexGrowToken;
export type FlexShrinkToken = keyof typeof flex.flexShrinkToken;
export type FlexSelfToken = keyof typeof flex.flexSelfToken;
export type FlexOrderToken = keyof typeof flex.flexOrderToken;
export type FlexBasisToken = keyof typeof flex.flexBasisToken;