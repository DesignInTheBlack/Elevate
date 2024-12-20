//Import Rule Files
import { Brand } from "../rules/example-brandRules.js";

//Spread Rules into Rules Object
export const rules = {
    ...Brand
};

//Define Custom Property and CSS Declaration Relationship
export const relationships = {
    //Example Custom Property Definition
    brand: 
    { "background-color": "BrandBackgroundRule", 
      "color": "BrandCopyRule" },
};