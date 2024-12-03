// ╔════════════════════════════════════════════════════════════════════╗
// ║                          MODULE IMPORTS                            ║
// ╚════════════════════════════════════════════════════════════════════╝

import { elevateCompiler } from './parser.js';
import { findClassAttributes } from './scan.js';
import { getBreakpointPriority } from './utility.js';
import { writeToFile } from './utility.js';
import { getModifierValue } from './utility.js';
import { config } from './config/elevate.js'

// ╔════════════════════════════════════════════════════════════════════╗
// ║                        1. SCAN FILES                               ║
// ║ Scan the files in the provided directory and retrieve class lists. ║
// ╚════════════════════════════════════════════════════════════════════╝
const scannedClasses = findClassAttributes(config.Watch, config.FileTypes);

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

let breakpointSupervisor = null;
let compiledCSS = '';
let mediaQueryOpen = false;

compiledClasses.forEach((item) => {
  const stateSelector = item.state ? `:${item.state}` : "";

  if (item.breakpoint !== breakpointSupervisor) {
    // Close previous media query if open
    if (mediaQueryOpen) {
      compiledCSS += `}\n\n`;
      mediaQueryOpen = false;
    }

    breakpointSupervisor = item.breakpoint;

    // Open new media query if breakpoint exists
    if (item.breakpoint) {
      const breakpoint = getModifierValue(item.breakpoint.replace(/\//g, ""));
      const breakpointTransition = `@media only screen and (min-width:${breakpoint}) {`;
      compiledCSS += `${breakpointTransition}\n`;
      mediaQueryOpen = true;
    }
  }

  const flexProperties =
    item.property === "row"
      ? "display:flex;\nflex-direction:row;"
      : item.property === "stack"
      ? "display:flex;\nflex-direction:column;"
      : "";

  const modifiers = item.modifiers.map((modifier) => `${modifier};`).join("\n");

  compiledCSS += `.${escapeClassName(item.className)}${stateSelector} {\n${flexProperties}\n${modifiers}\n}\n\n`;
});

// Close the last media query if open
if (mediaQueryOpen) {
  compiledCSS += `}\n`;
}

writeToFile(compiledCSS);