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

try {
  // Attempt to copy the folder
  copyFolderSync(sourceFolder, destinationFolder);
  console.log(`Folder successfully copied to: ${destinationFolder}`);
} catch (err) {
  console.error('Error copying folder:', err);
}