#!/usr/bin/env node

import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command-line arguments
const args = process.argv.slice(2);
const command = args[0];

// Define paths
const indexFile = path.resolve(__dirname, "../elevate/core/index.ts");
const installScript = path.resolve(__dirname, "./install.js");

if (command === "watch") {
  console.log("Running the watch command...");

  // Run the index.ts file using tsx
  exec(`npx tsx ${indexFile}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing watch: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Watch stderr: ${stderr}`);
      return;
    }
    console.log(`Watch stdout:\n${stdout}`);
  });

} else if (command === "prepare") {
  console.log("Running the prepare command...");

  // Execute the install.js script
  exec(`node ${installScript}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing prepare: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Prepare stderr: ${stderr}`);
      return;
    }
    console.log(`Prepare stdout:\n${stdout}`);
  });

} else {
  console.error(`Unknown command: ${command}`);
  console.log("Available commands: watch, prepare");
}
