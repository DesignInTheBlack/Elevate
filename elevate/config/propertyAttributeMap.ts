
//Attribute Mapping
export const propertyAttributeMap = {

    //Text Properties
    text: {
        "font-size":"FontSizeToken",
        color:"ColorToken",
        "font-weight":"FontWeightToken"
    },

    //Flex Row Properties
    row: {
        "justify-content":"RowMainToken",
        "align-items":"RowCrossToken"
    },
    
    //Flex Column Properties
    stack: {
        "justify-content":"ColCrossToken",
        "align-items":"ColMainToken"
    }
}



export type propertyMap = keyof typeof propertyAttributeMap;
export const propertyKeys = Object.keys(propertyAttributeMap) as propertyMap[];