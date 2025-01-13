import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define source and destination paths
const sourceFolder = path.resolve(__dirname, '../elevate');
const destinationFolder = path.resolve(process.cwd(), 'elevate');

console.log('Source folder:', sourceFolder);
console.log('Destination folder:', destinationFolder);

function copyFolderSync(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  fs.readdirSync(source).forEach((item) => {
    const sourcePath = path.join(source, item);
    const destinationPath = path.join(destination, item);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyFolderSync(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  });
}

function addElevateScriptToPackageJson() {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');

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

  // Resolve the path to tsx from the elevate-framework package's node_modules
  const elevateFrameworkNodeModules = path.resolve(__dirname, '../node_modules/.bin/tsx');

  // Add the "elevate" script with the full path to tsx
  packageJson.scripts.elevate = `node ${elevateFrameworkNodeModules} elevate/core/index.ts`;

  // Write the updated package.json back to disk
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
  console.log('Added "elevate" script to package.json. You can now run "npm run elevate".');
}

try {
  // Attempt to copy the folder
  copyFolderSync(sourceFolder, destinationFolder);
  console.log(`Folder successfully copied to: ${destinationFolder}`);

  // Add the elevate script to the user's package.json
  addElevateScriptToPackageJson();
} catch (err) {
  console.error('Error:', err);
}
