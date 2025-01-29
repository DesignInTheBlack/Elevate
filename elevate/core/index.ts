// ╔════════════════════════════════════════════════════════════════════╗
// ║                          MODULE IMPORTS                            ║
// ╚════════════════════════════════════════════════════════════════════╝

import { elevateCompiler } from './parser.js';
import { findClassAttributes } from './scan.js';
import { getBreakpointPriority } from './utility.js';
import { writeToFile } from './utility.js';
import { getModifierValue } from './utility.js';
import { config } from '../config/elevate.js'
import chokidar from 'chokidar';
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
            return;
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

           
            // Variable to hold the removed item
            let scopeItem = null;

            // Find and remove the item containing "scope"
            classList = classList.filter(item => {
                if (item.includes('scope')) {
                    scopeItem = item;
                    return false; // Exclude it from the new array
                }
                return true; // Keep other items
            });
            
         

            classList.forEach(function (classString) {
                if (!classString.startsWith("-")) {
                    const regex = /\/[a-zA-Z]{1,3}\//;
                    // ════ Mobile-First Breakpoint Processing ════
                    if (regex.test(classString)) {
                        lastBreak = classString;
                        return;
                    }

                    let classObject = elevateCompiler(classString,{ fileName: instance.file, lineNumber: instance.lineNumber });
                    classObject.breakpoint = lastBreak;
                    classObject.scope = scopeItem;
                 
                    
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
            const key = `${item.className}${item.breakpoint || ''}${item.scope || ''}`; // Include scope
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
            className.replace(/[@:\[\]()\/.,+#~=%]/g, (match) => `\\${match}`);

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
            : item.property === "col"
            ? "display:flex;\nflex-direction:column;"
            : item.property === "row-r"
            ? "display:flex;\nflex-direction:row-reverse;"
            : item.property === "col-r"
            ? "display:flex;\nflex-direction:column-reverse;"
              : item.property === "grid"
            ? "display:grid;"
            : "";

            const modifiers = item.modifiers.map((modifier) => `${modifier};`).join("\n");

            compiledCSS += `${item.scope ? `.${escapeClassName(item.scope)}` : ''}.${escapeClassName(item.className)}${stateSelector} {` +
            (flexProperties ? `\n${flexProperties}` : '') +
            `\n${modifiers}\n}\n\n`;

      
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
        console.clear();
        spinner.succeed('Elevate CSS Compilation Successful!');
    } catch (error) {
        spinner.fail(`Compilation failed: ${error.message}`);
        return;
    }
};



const watcher = chokidar.watch(config.Watch, {
    persistent: true,
    ignoreInitial: true,
    ignored: ['**/*.css'],
    interval: 1000,
    binaryInterval: 300,
});

watcher.on('ready', () => {
    console.clear();
    console.log('Elevate CSS is watching for changes...');
});

watcher.on('change', () => {
    console.clear();
    main();
});


process.on('SIGINT', function() {
    console.log('Elevate CSS is shutting down...');
    process.exit(1);
});
