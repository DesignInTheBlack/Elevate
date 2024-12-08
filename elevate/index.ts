// ╔════════════════════════════════════════════════════════════════════╗
// ║                          MODULE IMPORTS                            ║
// ╚════════════════════════════════════════════════════════════════════╝

import { elevateCompiler } from './parser.js';
import { findClassAttributes } from './scan.js';
import { getBreakpointPriority } from './utility.js';
import { writeToFile } from './utility.js';
import { getModifierValue } from './utility.js';
import { config } from './config/elevate.js'
import ora from 'ora';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const main = async () => {
    const spinner = ora({
        text: 'Elevating Your CSS..',
        color: 'magentaBright',
        spinner:'dots'
    }).start();

    if (!config.Watch || !config.FileTypes) {
      throw new Error('Invalid configuration: Watch directory and FileTypes must be specified');
  }

    try {
        // ╔════════════════════════════════════════════════════════════════════╗
        // ║                        1. SCAN FILES                               ║
        // ║ Scan the files in the provided directory and retrieve class lists. ║
        // ╚════════════════════════════════════════════════════════════════════╝
        spinner.text = 'Scanning files for Elevate classes...';
        await delay(500);
        let scannedClasses;
        try {
            scannedClasses = findClassAttributes(config.Watch, config.FileTypes);
        } catch (err) {
            console.error('Failed to scan for classes:', err.message);
            process.exit(1);
        }
        
        if (!scannedClasses || scannedClasses.length === 0) {
            console.warn('No classes found in the specified files.');
        }

        // ╔════════════════════════════════════════════════════════════════════╗
        // ║                  2. INITIALIZE DATA STRUCTURES                     ║
        // ║ Define the compiledClasses array and placeholder for types.        ║
        // ╚════════════════════════════════════════════════════════════════════╝
        spinner.text = 'Processing class definitions...';
        await delay(300);
        let compiledClasses: any[] = [];

        // ╔════════════════════════════════════════════════════════════════════╗
        // ║                    3. Establish Breakpoints                        ║
        // ║ Process classes by breakpoints, using elevateCompiler.             ║
        // ║ - Detects breakpoints                                              ║
        // ║ - Adds them to class objects                                       ║
        // ╚════════════════════════════════════════════════════════════════════╝
        function establishBreakpoints(instance) {
          if (!instance || !instance.classes) {
            throw new Error('Invalid class instance provided');
        }
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
                    let classObject = elevateCompiler(classString,{ fileName: instance.file });
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
        spinner.text = 'Organizing and sorting classes...';
        await delay(300);
        compiledClasses.sort((a, b) => {
            // Handle empty breakpoints (put them first)
            if (!a.breakpoint) return -1;
            if (!b.breakpoint) return 1;

            return getBreakpointPriority(a.breakpoint) - getBreakpointPriority(b.breakpoint);
        });

        // Deduplicate classes
        const uniqueClasses = new Map();
        compiledClasses.forEach(item => {
            const key = `${item.className}${item.breakpoint || ''}`;
            if (!uniqueClasses.has(key)) {
                uniqueClasses.set(key, item);
            }
        });

        // Convert back to array
        compiledClasses = Array.from(uniqueClasses.values());

        // ╔════════════════════════════════════════════════════════════════════╗
        // ║                       6. OUTPUT RESULTS                            ║
        // ║ Compile the results into a CSS file                                ║
        // ╚════════════════════════════════════════════════════════════════════╝

        // Helper function to escape special characters in class names
        const escapeClassName = (className) =>
            className.replace(/[@:\[\]]/g, (match) => `\\${match}`); // Escape special characters

        spinner.text = 'Generating CSS output...';
        await delay(400);
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
                if (breakpointSupervisor) {
                    const breakpoint = getModifierValue(item.breakpoint.replace(/\//g, ""));
                    if (!breakpoint) {
                      throw new Error(`Invalid breakpoint value: ${item.breakpoint}`);
                  }
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

        // Write the final CSS output
        spinner.text = 'Writing CSS file...';
        await delay(300);
        if (!compiledCSS) {
          throw new Error('No CSS content generated!');
      }
        writeToFile(compiledCSS);
        
        spinner.succeed('Compilation Successful.');
    } catch (error) {
        spinner.fail(`Compilation failed: ${error.message}`);
        process.exit(1);
    }
};

// Execute the main function
main();