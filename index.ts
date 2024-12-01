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
        const regex = /\/[a-zA-Z]+\//;

        // ════ Mobile-First Breakpoint Processing ════
        if (regex.test(classString)) {
            lastBreak = classString;
            return;
        }

        let classObject = elevateCompiler(classString);
        classObject.breakpoint = lastBreak;
        compiledClasses.push(classObject);
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
compiledClasses = compiledClasses.map((item) => {
    // Helper function to escape special characters in class names
    const escapeClassName = (className) => {
      return className
        .replace(/@/g, '\\@') // Escape '@'
        .replace(/:/g, '\\:') // Escape ':'
        .replace(/\[/g, '\\[') // Escape '['
        .replace(/\]/g, '\\]'); // Escape ']'
    };
  
    // Generate the rule
    return `
.${escapeClassName(item.className)}${item.state ? `:${item.state}` : ``} {
${item.modifiers.map(modifier => `${modifier};`).join('\n')}
}`;
  });


const compiledCSS = compiledClasses.join('\n\n');
writeToFile(compiledCSS);