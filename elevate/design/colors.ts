export const colors = {
    'purple': '#6665DD',
    'dark':'#2C2638',
    'white':'#F0EFF4',
    'warn':'#FABC2A',
    'error':'#D81E5B'
} as const;

export type ColorToken = keyof typeof colors;