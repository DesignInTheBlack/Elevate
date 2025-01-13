import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define source and destination paths
const sourceFolder = path.resolve(__dirname, '../elevate');
const destinationFolder = path.resolve(process.cwd(), 'elevate');

// Parse package.json path
const packageJsonPath = path.resolve(process.cwd(), 'package.json');

// Resolve the tsx binary relative to the elevate-framework package
const elevateFrameworkBinPath = path.posix.join(
  path.relative(process.cwd(), path.resolve(__dirname, '../node_modules/.bin/tsx'))
);

// Function to copy the folder
function copyFolderSync(source, destination) {
  if (!fs.existsSync(source)) {
    console.error(`Source folder does not exist: ${source}`);
    return;
  }

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

// Function to add the "elevate" script to package.json
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

// Run the folder copy and script addition logic
try {
  console.log('Source folder:', sourceFolder);
  console.log('Destination folder:', destinationFolder);

  // Copy the folder
  copyFolderSync(sourceFolder, destinationFolder);
  console.log(`Folder successfully copied to: ${destinationFolder}`);

  // Add the elevate script to package.json
  addElevateScriptToPackageJson();
} catch (error) {
  console.error('Error:', error);
}
