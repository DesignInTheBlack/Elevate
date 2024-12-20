//Example Custom Syntax Rules Import
import { Brand } from "../rules/example-brandRules.js";

//Defining Syntax Rules
export const rules = {
    ...Brand
};

//Defining CSS Relationships
export const relationships = {
    //Example Custom Property Definition
    brand: 
    { "background-color": "BrandBackgroundRule", 
      "color": "BrandCopyRule" },
};