export const flex = {
    
    rowMain: {
        "h-start": "flex-start",
        "h-end": "flex-end",
        "h-center": "center",
        "h-between": "space-between",
        "h-around": "space-around",
        "h-evenly": "space-evenly"
      },
    
      rowCross: {
        "v-start": "flex-start",
        "v-end": "flex-end",
        "v-center": "center",
        "v-baseline": "baseline",
        "v-stretch": "stretch"
      },
    
      colMain: {
        "v-start": "flex-start",
        "v-end": "flex-end",
        "v-center": "center",
        "v-between": "space-between",
        "v-around": "space-around",
        "v-evenly": "space-evenly"
      },
        
      colCross: {
        "h-start": "flex-start",
        "h-end": "flex-end",
        "h-center": "center",
        "h-baseline": "baseline",
        "h-stretch": "stretch"
      },

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
        "basis-": "SpacingToken"     // Uses prefix pattern for compound tokens
      }



} as const;

export type FlexToken = keyof typeof flex;
export type FlexGrowToken = keyof typeof flex.flexGrowToken;
export type RowMainToken = keyof typeof flex.rowMain;
export type RowCrossToken = keyof typeof flex.rowCross;
export type ColMainToken = keyof typeof flex.colMain;
export type ColCrossToken = keyof typeof flex.colCross;
export type FlexShrinkToken = keyof typeof flex.flexShrinkToken;
export type FlexSelfToken = keyof typeof flex.flexSelfToken;
export type FlexOrderToken = keyof typeof flex.flexOrderToken;
export type FlexBasisToken = keyof typeof flex.flexBasisToken;