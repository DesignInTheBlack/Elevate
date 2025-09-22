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

const VALID_CLASS = /^[A-Za-z0-9@:\/_\-\[\].()=?&%+,~!$^*'";<>|{}]+$/; 

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
const extractClassesFromTemplateExpression = (expression) => {
  const expr = expression.slice(2, -1).trim(); // Remove ${ }
  
  const patterns = {
    // Basic conditional: condition && 'class'
    logicalAnd: {
      test: /^(.+?)\s*&&\s*['"`]([^'"`]+)['"`]$/,
      extract: (match) => [match[2]]
    },
    
    // Basic ternary: condition ? 'class1' : 'class2'
    ternary: {
      test: /^(.+?)\s*\?\s*['"`]([^'"`]+)['"`]\s*:\s*['"`]([^'"`]+)['"`]$/,
      extract: (match) => [match[2], match[3]]
    },
    
    // Ternary with empty string: condition ? 'class' : ''
    ternaryWithEmpty: {
      test: /^(.+?)\s*\?\s*['"`]([^'"`]+)['"`]\s*:\s*['"`]['"`]$/,
      extract: (match) => [match[2]]
    },
    
    // Ternary with empty string first: condition ? '' : 'class'
    ternaryEmptyFirst: {
      test: /^(.+?)\s*\?\s*['"`]['"`]\s*:\s*['"`]([^'"`]+)['"`]$/,
      extract: (match) => [match[2]]
    },
    
    // Multiple conditions with &&: condition1 && condition2 && 'class'
    multipleLogicalAnd: {
      test: /^(.+?)\s*&&\s*(.+?)\s*&&\s*['"`]([^'"`]+)['"`]$/,
      extract: (match) => [match[3]]
    },
    
    // Negated condition: !condition && 'class'
    negatedLogicalAnd: {
      test: /^!(.+?)\s*&&\s*['"`]([^'"`]+)['"`]$/,
      extract: (match) => [match[2]]
    },
    
    // Template literal with variable: `class-${variable}`
    templateLiteralWithVar: {
      test: /^['"`]([^'"`$]+)\$\{[^}]+\}([^'"`]*)['"`]$/,
      extract: (match) => [] // Can't extract static classes from dynamic ones
    },
    
    // Function call returning class: getClass()
    functionCall: {
      test: /^[a-zA-Z_$][a-zA-Z0-9_$]*\([^)]*\)$/,
      extract: (match) => [] // Can't extract from function calls
    },
    
    // Clsx with static string: clsx('class1 class2')
    clsxStatic: {
      test: /^clsx\s*\(\s*['"`]([^'"`]+)['"`]\s*\)$/,
      extract: (match) => match[1].split(/\s+/)
    },
    
    // Clsx with conditional: clsx('base', condition && 'conditional')
    clsxWithConditional: {
      test: /^clsx\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*(.+?)\s*&&\s*['"`]([^'"`]+)['"`]\s*\)$/,
      extract: (match) => [match[1], match[3]].join(' ').split(/\s+/)
    },
    
    // Clsx with ternary: clsx('base', condition ? 'class1' : 'class2')
    clsxWithTernary: {
      test: /^clsx\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*(.+?)\s*\?\s*['"`]([^'"`]+)['"`]\s*:\s*['"`]([^'"`]+)['"`]\s*\)$/,
      extract: (match) => [match[1], match[3], match[4]].join(' ').split(/\s+/)
    },
    
    // Clsx with object: clsx({ 'class1': condition, 'class2': condition2 })
    clsxObject: {
      test: /^clsx\s*\(\s*\{\s*(.+?)\s*\}\s*\)$/,
      extract: (match) => {
        const objectContent = match[1];
        const classes = [];
        const pairs = objectContent.match(/['"`]([^'"`]+)['"`]\s*:\s*[^,}]+/g);
        if (pairs) {
          pairs.forEach(pair => {
            const classMatch = pair.match(/['"`]([^'"`]+)['"`]/);
            if (classMatch) classes.push(classMatch[1]);
          });
        }
        return classes.flatMap(c => c.split(/\s+/));
      }
    },
    
    // Classnames (alias for clsx): classNames('class1', condition && 'class2')
    classNamesWithConditional: {
      test: /^classNames\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*(.+?)\s*&&\s*['"`]([^'"`]+)['"`]\s*\)$/,
      extract: (match) => [match[1], match[3]].join(' ').split(/\s+/)
    },
    
    // Array join: [condition && 'class1', 'class2'].join(' ')
    arrayJoin: {
      test: /^\[(.+?)\]\.join\s*\(\s*['"`]\s*['"`]\s*\)$/,
      extract: (match) => {
        const arrayContent = match[1];
        const classes = [];
        const conditionals = arrayContent.match(/['"`]([^'"`]+)['"`]/g);
        if (conditionals) {
          conditionals.forEach(cond => {
            const classMatch = cond.match(/['"`]([^'"`]+)['"`]/);
            if (classMatch) classes.push(classMatch[1]);
          });
        }
        return classes.flatMap(c => c.split(/\s+/));
      }
    },
    
    // Filter pattern: ['base', condition && 'conditional'].filter(Boolean).join(' ')
    arrayFilterJoin: {
      test: /^\[(.+?)\]\.filter\s*\(\s*Boolean\s*\)\.join\s*\(\s*['"`]\s*['"`]\s*\)$/,
      extract: (match) => {
        const arrayContent = match[1];
        const classes = [];
        const items = arrayContent.match(/['"`]([^'"`]+)['"`]/g);
        if (items) {
          items.forEach(item => {
            const classMatch = item.match(/['"`]([^'"`]+)['"`]/);
            if (classMatch) classes.push(classMatch[1]);
          });
        }
        return classes.flatMap(c => c.split(/\s+/));
      }
    },
    
    // Variable reference: someVariable
    variableReference: {
      test: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
      extract: (match) => [] // Can't extract from variables
    },
    
    // Object property: obj.classes
    objectProperty: {
      test: /^[a-zA-Z_$][a-zA-Z0-9_$]*\.[a-zA-Z_$][a-zA-Z0-9_$]*$/,
      extract: (match) => [] // Can't extract from object properties
    },
    
    // Computed property: obj['classes']
    computedProperty: {
      test: /^[a-zA-Z_$][a-zA-Z0-9_$]*\[['"`][^'"`]+['"`]\]$/,
      extract: (match) => [] // Can't extract from computed properties
    },
    
    // Complex ternary with multiple classes: condition ? 'class1 class2' : 'class3 class4'
    ternaryMultipleClasses: {
      test: /^(.+?)\s*\?\s*['"`]([^'"`\s]+(?:\s+[^'"`\s]+)*)['"`]\s*:\s*['"`]([^'"`\s]+(?:\s+[^'"`\s]+)*)['"`]$/,
      extract: (match) => [...match[2].split(/\s+/), ...match[3].split(/\s+/)]
    },
    
    // Parenthesized condition: (condition) && 'class'
    parenthesizedConditional: {
      test: /^\((.+?)\)\s*&&\s*['"`]([^'"`]+)['"`]$/,
      extract: (match) => [match[2]]
    },
    
    // String concatenation: 'base ' + (condition ? 'active' : 'inactive')
    stringConcatenation: {
      test: /^['"`]([^'"`]+)['"`]\s*\+\s*\((.+?)\s*\?\s*['"`]([^'"`]+)['"`]\s*:\s*['"`]([^'"`]+)['"`]\)$/,
      extract: (match) => [match[1], match[3], match[4]].join(' ').split(/\s+/)
    },
    
    // Logical OR with fallback: condition && 'class' || 'fallback'
    logicalOrFallback: {
      test: /^(.+?)\s*&&\s*['"`]([^'"`]+)['"`]\s*\|\|\s*['"`]([^'"`]+)['"`]$/,
      extract: (match) => [match[2], match[3]]
    }
  };
  
  for (const [name, pattern] of Object.entries(patterns)) {
    const match = expr.match(pattern.test);
    if (match) {
      return pattern.extract(match).filter(Boolean);
    }
  }
  
  return []; // No recognized pattern
 };


 const extractStaticClassesFromTemplate = (raw) => {
  const found = [];

  // 1. Get static parts
  const parts = raw.split(/\$\{[^}]*\}/);
  parts.forEach(part => {
    found.push(...part.trim().split(/\s+/));
  });

  // 2. Extract from expressions using the pattern matcher
  const expressions = raw.match(/\$\{[^}]*\}/g) || [];
  expressions.forEach(expr => {
    const extractedClasses = extractClassesFromTemplateExpression(expr);
    found.push(...extractedClasses);
  });

  return found.filter(Boolean);
};

/**
 * Extract class attributes from file content with line numbers
 */
const extractClasses = (content, classList, filePath) => {
  const cleanedContent = removeCommentsAndCodeBlocks(content)

  config.ClassRegex.forEach((regex) => {
    // Create multiline version of the regex
    const multilineRegex = new RegExp(regex.source, 'gms')
    
    let match
    while ((match = multilineRegex.exec(cleanedContent)) !== null) {
      // Calculate line number from match position
      const beforeMatch = cleanedContent.substring(0, match.index)
      const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1
      
      let classValue = match[1].trim()

      if (regex.source.includes('`') || regex.source.includes('{')) {
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

      const parts = (classString.match(/(?:\([^)]*\)|\S+)/g) || []).filter(Boolean);

      const classNames = parts
        .map((part) => {
          const i = placeholders.indexOf(part)
          return i !== -1 ? states[i] : part
        })
        .filter(isValidClass)

      if (classNames.length > 0) {
        classList.push({
          file: filePath,
          lineNumber: lineNumber,
          classes: classNames
        })
      }
    }
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
