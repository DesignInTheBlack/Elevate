import { colors, type ColorToken } from '../design/colors.js';
import { typography, type FontSize } from '../design/typography.js';

//Need to finish integrating design system specific tokens into syntax objects and expanding properties/modifiers

export const syntax = {
    sequences: {
        text: {
            property: 'text',
            modifiers: {
                // Get all the keys from typography.size
                size: Object.keys(typography.size),
                // Get all the keys from colors
                color: Object.keys(colors)
            }
        }
    }
}