// preprocess.js
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

// Define your breakpoints as per your Tailwind config
const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'];

async function processFile(filePath) {
  try {
    // Read the content of the file
    let content = await fs.readFile(filePath, 'utf8');

    // Regex to match class attributes
    const classRegex = /class\s*=\s*"([^"]*)"/g;

    content = content.replace(classRegex, (match, classAttribute) => {
      const transformedClasses = transformClassAttribute(classAttribute);
      return `class="${transformedClasses}"`;
    });

    // Construct the output path by replacing 'src' with 'dist'
    const relativePath = path.relative('src', filePath);
    const outputPath = path.join('dist', relativePath);

    // Ensure the directory exists
    await fs.ensureDir(path.dirname(outputPath));

    // Write the transformed content to the output path
    await fs.writeFile(outputPath, content);

    console.log(`Processed ${filePath} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

function transformClassAttribute(classValue) {
  // Split the class attribute by '/'
  const segments = classValue.split('/');
  let resultClasses = [];
  let currentPrefix = '';

  segments.forEach(segment => {
    segment = segment.trim();
    if (segment === '') {
      // Ignore empty segments
      return;
    }
    if (BREAKPOINTS.includes(segment)) {
      // Update the current prefix
      currentPrefix = `${segment}:`;
    } else {
      // Process classes
      const classes = segment.split(/\s+/).flatMap(cls => {
        // Handle margin/padding shorthand
        if ((cls.startsWith('m-') || cls.startsWith('p-')) && cls.includes('.')) {
          return expandMarginPaddingShorthand(cls, currentPrefix);
        } else {
          // Add class with current prefix
          return `${currentPrefix}${cls}`;
        }
      });
      resultClasses.push(...classes);
    }
  });

  return resultClasses.join(' ');
}

function expandMarginPaddingShorthand(cls, prefix) {
  const [property, valuesStr] = cls.split('-');
  const values = valuesStr.split('.');

  // Handle cases with 1 to 4 values, similar to CSS shorthand
  let top, right, bottom, left;

  if (values.length === 1) {
    top = right = bottom = left = values[0];
  } else if (values.length === 2) {
    top = bottom = values[0];
    right = left = values[1];
  } else if (values.length === 3) {
    top = values[0];
    right = left = values[1];
    bottom = values[2];
  } else if (values.length === 4) {
    [top, right, bottom, left] = values;
  } else {
    // If not between 1 and 4 values, return the class as is
    return `${prefix}${cls}`;
  }

  const propertyMap = {
    m: 'm',  // Margin
    p: 'p',  // Padding
  };

  const directions = ['t', 'r', 'b', 'l']; // top, right, bottom, left
  const sides = [top, right, bottom, left];

  // Construct the expanded classes
  return sides.map((value, index) => {
    const direction = directions[index];
    return `${prefix}${propertyMap[property]}${direction}-${value}`;
  });
}

// Process all HTML files in the 'src' directory
(async () => {
  try {
    const files = await glob('src/**/*.html', { nodir: true });

    if (files.length === 0) {
      console.warn('No HTML files found in src directory.');
    } else {
      console.log('Found files:', files);
      for (const file of files) {
        await processFile(file);
      }
    }
  } catch (error) {
    console.error('Error during glob operation:', error);
  }
})();
