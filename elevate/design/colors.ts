export const colors = {
    'purple': '#6320EE',
    'grey': '#f1EEf7', 
    'green':'#81C14B',
    'pink':'#FD3E81',
    'blue':'#0496FF',
    'darkgrey':'#666666',
    'white': '#F7F5FB',
    'black':'#0A141F',
    'error': '#F40076',
    'warn': '#F7B538',
} as const;

export type ColorToken = keyof typeof colors;