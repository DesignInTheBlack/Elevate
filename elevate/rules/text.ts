export const text = {
    align: {
        'left': 'left',
        'center': 'center',
        'right': 'right',
        'justify': 'justify'
      },

      transform: {
        'uppercase': 'uppercase',
        'lowercase': 'lowercase',
        'capitalize': 'capitalize'
      }


} as const;

export type textAlignToken = keyof typeof text.align;
export type textTransformToken = keyof typeof text.transform;
