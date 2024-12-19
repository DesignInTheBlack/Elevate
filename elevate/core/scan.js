import fs from 'fs';
import path from 'path';
//Configuration Options
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
 * Extract class attributes from file content with line numbers
 * @param {string} content - The file's content as a string
 * @param {Array<Object>} classList - Array to store extracted classes
 * @param {string} filePath - Path to the file being processed
 */
const extractClasses = (content, classList, filePath) => {
    const lines = content.split('\n');
    const regex = /class\s*=\s*"([^"]+)"/g;

    lines.forEach((line, lineNumber) => {
        let match;

        while ((match = regex.exec(line)) !== null) {
            const classValue = match[1].trim();

            // Find and handle state patterns
            const statePattern = /@[^\:\s]+\:\[[^\]]+\]/g;
            let classString = classValue;
            const states = [];
            let stateMatch;
            let index = 0;
            const placeholders = [];

            // Replace state patterns with placeholders and store them
            while ((stateMatch = statePattern.exec(classValue)) !== null) {
                const placeholder = `__STATE${index}__`;
                states.push(stateMatch[0]);
                placeholders.push(placeholder);
                classString = classString.replace(stateMatch[0], placeholder);
                index++;
            }

            // Split the string (now with placeholders) by whitespace
            const parts = classString.split(/\s+/).filter(Boolean);

            // Restore state patterns in their original positions
            const classNames = parts.map(part => {
                const placeholderIndex = placeholders.indexOf(part);
                return placeholderIndex !== -1 ? states[placeholderIndex] : part;
            });

            classList.push({
                file: filePath,
                lineNumber: lineNumber + 1, // Line numbers are 1-based
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
};