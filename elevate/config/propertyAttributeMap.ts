
//Attribute Mapping
export const propertyAttributeMap = {
    //Text Properties
    text: {
        "font-size":"FontSizeToken",
        color:"ColorToken",
        "font-weight":"FontWeightToken"
    }
}



export type propertyMap = keyof typeof propertyAttributeMap;
export const propertyKeys = Object.keys(propertyAttributeMap) as propertyMap[];