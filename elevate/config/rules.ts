//Defining Syntax Rules
export const rules = {
    BrandRule: {
        "theme-": "ColorToken"
    },
};

//Defining CSS Relationships
export const relationships = {
    brand: { "background-color": "BrandRule" },
};