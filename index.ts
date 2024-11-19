import { elevateCompiler } from './elevate/parser';


function compileToCSS(input) {
    let obj;
  
    // Parse JSON string if the input is not an object
    if (typeof input === "string") {
      try {
        obj = JSON.parse(input);
      } catch (error) {
        throw new Error("Invalid JSON string provided.");
      }
    } else if (typeof input === "object" && input !== null) {
      obj = input;
    } else {
      throw new Error("Invalid input: Must be a JSON string or an object.");
    }
  
    // Validate required properties
    const { type, className, modifiers } = obj;
  
    if (type !== "Stateless Class") {
      throw new Error("Invalid type: Only 'Stateless Class' objects are supported.");
    }
  
    if (!className || typeof className !== "string") {
      throw new Error("Invalid input: 'className' must be a non-empty string.");
    }
  
    if (!Array.isArray(modifiers) || modifiers.length === 0) {
      throw new Error("Invalid input: 'modifiers' must be a non-empty array.");
    }
  
    // Escape colons in className for valid CSS
    const escapedClassName = className.replace(/:/g, "\\:");
  
    // Join modifiers into CSS properties
    const cssProperties = modifiers
      .map(mod => {
        const [property, value] = mod.split(":").map(str => str.trim());
        return `${property}: ${value};`;
      })
      .join("\n  ");
  
    // Build the CSS rule
    return `.${escapedClassName} {\n  ${cssProperties}\n}`;
  }
  

let x = elevateCompiler('text:purple:small');
console.log("Compiled Class:" + '\n' + compileToCSS(x));

