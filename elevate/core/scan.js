import fs from 'fs'
import path from 'path'
import { config } from '../config/elevate.js'

/**
 * Recursively search for files of specific extensions within a directory
 */
const searchFiles = (dir, fileTypes, classList = []) => {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const fileStat = fs.lstatSync(filePath)

    if (fileStat.isDirectory()) {
      if (file === 'node_modules' || file.startsWith('.')) return
      searchFiles(filePath, fileTypes, classList)
    } else {
      const ext = path.extname(file).toLowerCase().substring(1)
      if (fileTypes.includes(ext)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        extractClasses(fileContent, classList, filePath)
      }
    }
  })

  return classList
}

/**
 * Remove triple-backtick code blocks, multi-line JS comments, single-line JS comments,
 * and HTML comments from file content.
 */
const removeCommentsAndCodeBlocks = (text) => {
  let cleaned = text
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '') // triple backticks
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '') // multiline comments
  cleaned = cleaned.replace(/(^|\s)\/\/.*$/gm, '$1') // single-line comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '') // HTML comments
  return cleaned
}

/**
 * Validate whether a class token is safe for Elevate
 */
const VALID_CLASS = /^[a-zA-Z0-9@:_/\-\[\]]+$/

const isValidClass = (c) => {
    if (!VALID_CLASS.test(c)) return false
  
    if (
      c.includes('::') ||
      (c.includes('[') && !c.includes(']')) ||
      (c.includes(']') && !c.includes('['))
    ) return false
  
    // Allow slash-wrapped breakpoints like /lg/
    const isSlashWrapped = /^\/[a-zA-Z0-9_-]{1,5}\/$/.test(c)
    if (c.startsWith('/') || c.endsWith('/')) {
      return isSlashWrapped
    }
  
    return true
  }

/**
 * Extract static class names from common template expressions
 */
const extractStaticClassesFromTemplate = (raw) => {
  const found = [];

  // 1) Grab every quoted substring anywhere in the template segment
  //    Handles single, double, and backtick quotes, with escapes.
  for (const m of raw.matchAll(/(['"`])((?:\\.|(?!\1).)+)\1/g)) {
    found.push(...m[2].split(/\s+/));
  }

  // 2) Remove all ${...} expressions entirely
  const withoutExpr = raw.replace(/\$\{[\s\S]*?\}/g, '');

  // 3) Add remaining static parts
  found.push(...withoutExpr.split(/\s+/));

  return found.filter(Boolean);
};

/**
 * Extract class attributes from file content with line numbers
 */
const extractClasses = (content, classList, filePath) => {
  const cleanedContent = removeCommentsAndCodeBlocks(content)
  const lines = cleanedContent.split('\n')

  config.ClassRegex.forEach((regex) => {
    lines.forEach((line, lineNumber) => {
      let match
      while ((match = regex.exec(line)) !== null) {
        let classValue = match[1].trim()

        if (regex.source.includes('`')) {
            const staticParts = extractStaticClassesFromTemplate(classValue)
            classValue = staticParts.join(' ')
          }

        const statePattern = /@[^\:\s]+\:\[[^\]]+\]/g
        const states = []
        const placeholders = []
        let index = 0
        let stateMatch
        let classString = classValue

        while ((stateMatch = statePattern.exec(classValue)) !== null) {
          const placeholder = `__STATE${index}__`
          states.push(stateMatch[0])
          placeholders.push(placeholder)
          classString = classString.replace(stateMatch[0], placeholder)
          index++
        }

        const parts = classString.split(/\s+/).filter(Boolean)

        const classNames = parts
          .map((part) => {
            const i = placeholders.indexOf(part)
            return i !== -1 ? states[i] : part
          })
          .filter(isValidClass)

        if (classNames.length > 0) {
          classList.push({
            file: filePath,
            lineNumber: lineNumber + 1,
            classes: classNames
          })
        }
      }
    })
  })
}

/**
 * Entrypoint for scanning
 */
export function findClassAttributes(startDir = process.cwd(), fileTypes = config.FileTypes) {
  try {
    return searchFiles(startDir, fileTypes)
  } catch (err) {
    console.error('Error traversing files:', err.message)
    return []
  }
}
