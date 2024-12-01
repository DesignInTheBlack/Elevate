
//Attribute Mapping
export const propertyAttributeMap = {

    //Spacing Properties
    m: {
        "margin-left":"left",
        "margin-right":"right",
        "margin-top":"top",
        "margin-bottom":"bottom",
    },

    p: {
        "padding-left":"left",
        "padding-right":"right",
        "padding-top":"top",
        "padding-bottom":"bottom",
    },

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
    },
    
    //Background Properties
    color: {
        "background-color":"ColorToken"
    }

}

export type propertyMap = keyof typeof propertyAttributeMap;
export const propertyKeys = Object.keys(propertyAttributeMap) as propertyMap[];