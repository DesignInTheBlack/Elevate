import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse package.json path
const packageJsonPath = path.resolve(process.cwd(), 'package.json');

// Resolve the tsx binary relative to the elevate-framework package
const elevateFrameworkBinPath = path.posix.join(
  path.relative(process.cwd(), path.resolve(__dirname, '../node_modules/.bin/tsx'))
);

// Define a function to add the "elevate" script
function addElevateScriptToPackageJson() {
  // Check if the user's package.json exists
  if (!fs.existsSync(packageJsonPath)) {
    console.error('Error: package.json not found in the current directory.');
    return;
  }

  // Read and parse the user's package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  // Initialize the scripts object if it doesn't exist
  packageJson.scripts = packageJson.scripts || {};

  // Check if the "elevate" script already exists
  if (packageJson.scripts.elevate) {
    console.warn(
      'Warning: The "elevate" script already exists in package.json. Skipping script addition.'
    );
    return;
  }

  // Add the "elevate" script with a normalized path to tsx
  packageJson.scripts.elevate = `node ${elevateFrameworkBinPath} elevate/core/index.ts`;

  // Write the updated package.json back to disk
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
  console.log('Added "elevate" script to package.json. You can now run "npm run elevate".');
}

// Run the script addition logic
try {
  addElevateScriptToPackageJson();
} catch (error) {
  console.error('Error adding elevate script:', error);
}
