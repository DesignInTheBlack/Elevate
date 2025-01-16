import fs from 'fs';
import path from 'path';
// Configuration Options
import { config } from '../config/elevate.js';

/**
 * Recursively search for files of specific extensions within a directory
 * @param {string} dir - Directory to start scanning
 * @param {Array<string>} fileTypes - File extensions to search for (e.g., ['html', 'jsx', 'tsx'])
 * @param {Array<Object>} classList - Accumulated results for class attributes
 * @returns {Array<Object>} - Array of objects with file, line number, and class lists
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
 * Remove triple-backtick code blocks, multi-line JS comments, single-line JS comments,
 * and HTML comments from file content.
 * 
 * @param {string} text - The file's raw content
 * @returns {string} - The cleaned content
 */
const removeCommentsAndCodeBlocks = (text) => {
    let cleaned = text;

    // 1. Remove triple-backtick code blocks (``` ... ```)
    cleaned = cleaned.replace(/```[\s\S]*?```/g, '');

    // 2. Remove multi-line JS comments (/* ... */)
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');

    // 3. Remove single-line JS comments (// ...)
    cleaned = cleaned.replace(/(^|\s)\/\/.*$/gm, '$1');

    // 4. Remove HTML comments (<!-- ... -->)
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

    return cleaned;
};

/**
 * Extract class attributes from file content with line numbers, ignoring commented sections
 * @param {string} content - The file's raw content
 * @param {Array<Object>} classList - Array to store extracted classes
 * @param {string} filePath - Path to the file being processed
 */
const extractClasses = (content, classList, filePath) => {
    // First, strip out comments and code blocks
    const cleanedContent = removeCommentsAndCodeBlocks(content);

    // Then, split by lines
    const lines = cleanedContent.split('\n');
    
    // Regex to match class="some classes"
    const regex = /class\s*=\s*"([^"]+)"/g;

    lines.forEach((line, lineNumber) => {
        let match;
        while ((match = regex.exec(line)) !== null) {
            const classValue = match[1].trim();

            // Find and handle state patterns: e.g., "@foo:[bar]"
            const statePattern = /@[^\:\s]+\:\[[^\]]+\]/g;
            let classString = classValue;
            const states = [];
            let stateMatch;
            let index = 0;
            const placeholders = [];

            // Replace state patterns with placeholders
            while ((stateMatch = statePattern.exec(classValue)) !== null) {
                const placeholder = `__STATE${index}__`;
                states.push(stateMatch[0]);
                placeholders.push(placeholder);
                classString = classString.replace(stateMatch[0], placeholder);
                index++;
            }

            // Split on whitespace
            const parts = classString.split(/\s+/).filter(Boolean);

            // Restore state patterns
            const classNames = parts.map(part => {
                const placeholderIndex = placeholders.indexOf(part);
                return placeholderIndex !== -1 ? states[placeholderIndex] : part;
            });

            classList.push({
                file: filePath,
                lineNumber: lineNumber + 1, // Lines are 1-based
                classes: classNames
            });
        }
    });
};

/**
 * Main function to scan the project directory
 * @param {string} startDir - The directory to start scanning (default: current directory)
 * @param {Array<string>} fileTypes - File extensions to scan for (e.g., ['html', 'jsx', 'tsx'])
 * @returns {Array<Object>} - Array of objects with file, line number, and class lists
 */
export function findClassAttributes(startDir = process.cwd(), fileTypes = config.FileTypes) {
    try {
        return searchFiles(startDir, fileTypes);
    } catch (err) {
        console.error('Error traversing files:', err.message);
        return [];
    }
}
