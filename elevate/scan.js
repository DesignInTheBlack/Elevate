import fs from 'fs';
import path from 'path';

/**
 * Recursively search for files of specific extensions within a directory
 * @param {string} dir - Directory to start scanning
 * @param {Array<string>} fileTypes - File extensions to search for (e.g., ['html', 'jsx', 'tsx'])
 * @param {Array<Object>} classList - Accumulated results for class attributes
 * @returns {Array<Object>} - Array of objects with file and class lists
 * @throws {Error} - If directory access fails or file reading fails
 */
const searchFiles = (dir, fileTypes, classList = []) => {
    let files;
    try {
        files = fs.readdirSync(dir);
    } catch (err) {
        throw new Error(`Failed to read directory ${dir}: ${err.message}`);
    }

    files.forEach(file => {
        const filePath = path.join(dir, file);
        let fileStat;
        
        try {
            fileStat = fs.lstatSync(filePath);
        } catch (err) {
            console.error(`Failed to get stats for ${filePath}: ${err.message}`);
            return;
        }

        if (fileStat.isDirectory()) {
            // Skip node_modules and other irrelevant directories
            if (file === 'node_modules' || file.startsWith('.')) return;
            try {
                searchFiles(filePath, fileTypes, classList);
            } catch (err) {
                console.error(`Failed to process directory ${filePath}: ${err.message}`);
            }
        } else {
            const ext = path.extname(file).toLowerCase().substring(1);
            if (fileTypes.includes(ext)) {
                try {
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    extractClasses(fileContent, classList, filePath);
                } catch (err) {
                    throw new Error(`Failed to read file ${filePath}: ${err.message}`);
                }
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
    // Match both class="..." and className="..." with single or double quotes
    const patterns = [
        /class\s*=\s*["']([^"']+)["']/g,      // HTML class with both quote types
        /className\s*=\s*["']([^"']+)["']/g,   // JSX className with both quote types
        /className\s*=\s*\{["']([^"']+)["']\}/g // JSX className with curly braces
    ];

    let matches = new Set();

    patterns.forEach(regex => {
        let match;
        while ((match = regex.exec(content)) !== null) {
            // Split on whitespace and filter out empty strings
            const classNames = match[1].split(/\s+/).filter(Boolean);
            classNames.forEach(name => matches.add(name));
        }
    });

    if (matches.size > 0) {
        classList.push({
            file: filePath,
            classes: Array.from(matches)
        });
    }
};

/**
 * Main function to scan the project directory
 * @param {string} startDir - The directory to start scanning (default: current directory)
 * @param {Array<string>} fileTypes - File extensions to scan for (e.g., ['html', 'jsx', 'tsx'])
 * @returns {Array<Object>} - Array of objects with file and class lists
 */
export function findClassAttributes(startDir = process.cwd(), fileTypes = ['html', 'jsx', 'tsx', 'astro']) {
    if (!startDir || typeof startDir !== 'string') {
        throw new Error('Invalid start directory provided');
    }
    
    if (!Array.isArray(fileTypes) || fileTypes.length === 0) {
        throw new Error('File types must be a non-empty array');
    }

    try {
        // Verify directory exists and is accessible
        if (!fs.existsSync(startDir)) {
            throw new Error(`Directory ${startDir} does not exist`);
        }

        const stats = fs.statSync(startDir);
        if (!stats.isDirectory()) {
            throw new Error(`${startDir} is not a directory`);
        }

        return searchFiles(startDir, fileTypes);
    } catch (err) {
        console.error('Error in findClassAttributes:', err.message);
        throw err; // Re-throw to allow caller to handle the error
    }
};
