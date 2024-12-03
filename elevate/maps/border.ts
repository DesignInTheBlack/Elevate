export const border = {
    width: {
        "w-": "SpacingToken"
    },
    radius: {
        "r-": "SpacingToken"
    },
    style: {
        "s-": "BorderStyleToken"
    },
    color: {
        "c-": "ColorToken"
    }
} as const;

export type BorderToken = keyof typeof border;
export type BorderWidthToken = keyof typeof border.width;
export type BorderRadiusToken = keyof typeof border.radius;
export type BorderStyleToken = keyof typeof border.style;
export type BorderColorToken = keyof typeof border.color;