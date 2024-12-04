export const text = {
    align: {
        'left': 'left',
        'center': 'center',
        'right': 'right',
        'justify': 'justify'
      }
} as const;

export type textAlignToken = keyof typeof text.align;
