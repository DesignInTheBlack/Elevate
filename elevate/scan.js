import fs from 'fs';
import path from 'path';

/**
 * Recursively search for files of specific extensions within a directory
 * @param {string} dir - Directory to start scanning
 * @param {Array<string>} fileTypes - File extensions to search for (e.g., ['html', 'jsx', 'tsx'])
 * @param {Array<Object>} classList - Accumulated results for class attributes
 * @returns {Array<Object>} - Array of objects with file and class lists
 */
const searchFiles = (dir, fileTypes, classList = []) => {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const fileStat = fs.lstatSync(filePath);

        if (fileStat.isDirectory()) {
            // Skip node_modules and other irrelevant directories
            if (file === 'node_modules' || file.startsWith('.')) return;
            searchFiles(filePath, fileTypes, classList);
        } else {
            const ext = path.extname(file).toLowerCase().substring(1);
            if (fileTypes.includes(ext)) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                extractClasses(fileContent, classList, filePath);
            }
        }
    });

    return classList;
};
 
/**
 * Extract class attributes from file content
 * @param {string} content - The file's content as a string
 * @param {Array<Object>} classList - Array to store extracted classes
 * @param {string} filePath - Path to the file being processed
 */
const extractClasses = (content, classList, filePath) => {
    const regex = /class\s*=\s*"([^"]+)"/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
        const classValue = match[1].trim();

        // Regex to find the special state pattern @something:[...]
        const specialPattern = /@[^\:\s]+\:\[[^\]]+\]/;
        const specialMatch = classValue.match(specialPattern);

        let classNames;
        if (specialMatch) {
            // Extract the special token as a single class
            const specialClass = specialMatch[0];

            // Remove the special class from the string
            let remainder = classValue.replace(specialClass, "").trim();

            // Start with the special class
            classNames = [specialClass];

            // If there's anything left, split it on whitespace
            if (remainder.length > 0) {
                classNames.push(...remainder.split(/\s+/).filter(Boolean));
            }
        } else {
            // No special pattern found, just split normally by whitespace
            classNames = classValue.split(/\s+/).filter(Boolean);
        }

        classList.push({
            file: filePath,
            classes: classNames
        });
    }
};

/**
 * Main function to scan the project directory
 * @param {string} startDir - The directory to start scanning (default: current directory)
 * @param {Array<string>} fileTypes - File extensions to scan for (e.g., ['html', 'jsx', 'tsx'])
 * @returns {Array<Object>} - Array of objects with file and class lists
 */
export function findClassAttributes (startDir = process.cwd(), fileTypes = ['html', 'jsx', 'tsx', 'astro'])  {
    try {
        return searchFiles(startDir, fileTypes);
    } catch (err) {
        console.error('Error traversing files:', err.message);
        return [];
    }
};
