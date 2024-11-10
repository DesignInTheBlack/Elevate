import { colors, type ColorToken } from '../design/colors.js';

export const syntax = {
   sequences: {    
        //Text Sequence Definition
        text: {
           property: 'text',
           modifiers: {
               color: {
                   type: 'color' as const,
                   allowedValues: Object.keys(colors) as ColorToken[]
               }
           }
        }
        //
       
   }
} as const;

type SyntaxDefinition = typeof syntax
export type ValidProperties = keyof typeof syntax.sequences;
export type ValidColorValues = typeof syntax.sequences.text.modifiers.color.allowedValues[number];
export type ValidModifierTypes<T extends ValidProperties> = 
    keyof typeof syntax.sequences[T]['modifiers'];