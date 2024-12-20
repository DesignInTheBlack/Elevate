export const numeric = {
    NumericToken: {
        validate: (value: string) => {
            // Strip any prefix like 'c-' or 'r-'
            const cleanValue = value.split('-').pop() || value;
            
            // Explicitly convert to number first
            const num = Number(cleanValue);

            if (isNaN(num)) {
                throw new Error(`Invalid numeric value: ${value}. Must be a number.`);
            }

            return num.toString();
        }
    }
} 

