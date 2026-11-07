export const numeric = {
    NumericToken: {
        validate: (value: string) => {
            // A plain number keeps its sign (z:-1). Otherwise strip a prefix like 'order-'.
            const cleanValue = /^-?\d*\.?\d+$/.test(value) ? value : value.split('-').pop() || value;
            
            // Explicitly convert to number first
            const num = Number(cleanValue);

            if (isNaN(num)) {
                throw new Error(`Invalid numeric value: ${value}. Must be a number.`);
            }

            return num.toString();
        }
    }
} 

