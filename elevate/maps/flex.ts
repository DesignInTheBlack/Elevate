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
      }

} as const;

export type FlexToken = keyof typeof flex;
export type RowMainToken = keyof typeof flex.rowMain;
export type RowCrossToken = keyof typeof flex.rowCross;
export type ColMainToken = keyof typeof flex.colMain;
export type ColCrossToken = keyof typeof flex.colCross;