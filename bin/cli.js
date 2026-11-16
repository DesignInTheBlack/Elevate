#!/usr/bin/env node

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command-line arguments
const args = process.argv.slice(2);
const command = args[0];

// Define the path for the prepare script
const installScript = path.resolve(__dirname, "./install.js");

// Commands that run the project's own copy of the compiler, so they use that
// project's config: npx elevate-framework build
const projectCommands = new Set(["watch", "build", "check", "describe"]);

if (command === "prepare") {
  const child = spawn(process.execPath, [installScript], { stdio: "inherit" });
  child.on("exit", (code) => process.exit(code ?? 1));

} else if (projectCommands.has(command)) {
  const entry = path.resolve(process.cwd(), "elevate/core/index.ts");
  if (!fs.existsSync(entry)) {
    console.error("No Elevate project here. Run \"npx elevate-framework prepare\" first.");
    process.exit(1);
  }
  const child = spawn("npx", ["tsx", entry, ...args], { stdio: "inherit", shell: process.platform === "win32" });
  child.on("exit", (code) => process.exit(code ?? 1));

} else {
  console.error(`Unknown command: ${command}`);
  console.log("Available commands: prepare, watch, build, check, describe");
}
