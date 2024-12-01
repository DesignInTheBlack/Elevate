// ╔════════════════════════════════════════════════════════════════════╗
// ║                          MODULE IMPORTS                            ║
// ╚════════════════════════════════════════════════════════════════════╝
import { elevateCompiler } from './elevate/parser';
import { findClassAttributes } from './elevate/scan';
import { getBreakpointPriority } from './elevate/utility';
import { writeToFile } from './elevate/utility';

// ╔════════════════════════════════════════════════════════════════════╗
// ║                        1. SCAN FILES                               ║
// ║ Scan the files in the provided directory and retrieve class lists. ║
// ╚════════════════════════════════════════════════════════════════════╝
const scannedClasses = findClassAttributes('./', ['html']);

// ╔════════════════════════════════════════════════════════════════════╗
// ║                  2. INITIALIZE DATA STRUCTURES                     ║
// ║ Define the compiledClasses array and placeholder for types.        ║
// ╚════════════════════════════════════════════════════════════════════╝
let compiledClasses: any[] = [];

// ╔════════════════════════════════════════════════════════════════════╗
// ║                    3. Establish Breakpoints                        ║
// ║ Process classes by breakpoints, using elevateCompiler.             ║
// ║ - Detects breakpoints                                              ║
// ║ - Adds them to class objects                                       ║
// ╚════════════════════════════════════════════════════════════════════╝
function establishBreakpoints(instance) {
    let lastBreak = '';
    let classList = instance.classes;

    classList.forEach(function (classString) {
        
        if (!classString.includes("$")) {
        const regex = /\/[a-zA-Z]+\//;
        // ════ Mobile-First Breakpoint Processing ════
        if (regex.test(classString)) {
            lastBreak = classString;
            return;
        }
        let classObject = elevateCompiler(classString);
        classObject.breakpoint = lastBreak;

        compiledClasses.push(classObject);
      }
    });
}

// ╔════════════════════════════════════════════════════════════════════╗
// ║                   4. MAP SCANNED CLASSES                           ║
// ║ Apply the `structureClasses` function to each scanned class.       ║
// ╚════════════════════════════════════════════════════════════════════╝
scannedClasses.map(establishBreakpoints);

// ╔════════════════════════════════════════════════════════════════════╗
// ║                  5. SORT COMPILED CLASSES                          ║
// ║ Sort classes by breakpoint priority using getBreakpointPriority.   ║
// ║ Empty breakpoints are prioritized first.                           ║
// ╚════════════════════════════════════════════════════════════════════╝
compiledClasses.sort((a, b) => {
    // Handle empty breakpoints (put them first)
    if (!a.breakpoint) return -1;
    if (!b.breakpoint) return 1;

    return getBreakpointPriority(a.breakpoint) - getBreakpointPriority(b.breakpoint);
});

// ╔════════════════════════════════════════════════════════════════════╗
// ║                       6. OUTPUT RESULTS                            ║
// ║ Compile the results into a CSS file                                ║
// ╚════════════════════════════════════════════════════════════════════╝

// Helper function to escape special characters in class names
const escapeClassName = (className) => 
  className.replace(/[@:\[\]]/g, (match) => `\\${match}`); // Escape special characters

// Function to generate a compiled class rule
const generateClassRule = (item) => {
  const stateSelector = item.state ? `:${item.state}` : "";
  const flexProperties = 
    item.property === "row"
      ? "display:flex;\nflex-direction:row;"
      : item.property === "stack"
      ? "display:flex;\nflex-direction:column;"
      : "";

  const modifiers = item.modifiers.map((modifier) => `${modifier};`).join("\n");

  return `
.${escapeClassName(item.className)}${stateSelector} {
${flexProperties}
${modifiers}
}`;
};

// Transform compiled classes
compiledClasses = compiledClasses.map(generateClassRule);

const compiledCSS = compiledClasses.join('\n\n');
writeToFile(compiledCSS);