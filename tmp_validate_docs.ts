import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { elevateCompiler } from './elevate/core/parser.ts';

const docsRoot = process.argv[2] || 'C:/Users/desig/Desktop/elevate-docs/src/content/docs';

const isBreakpointToken = (token) => /^\/[a-zA-Z0-9_-]{1,5}\/$/.test(token);
const isEnvToken = (token) => /^env:[a-zA-Z0-9-]+(?::open)?$/.test(token);
const isCtxToken = (token) => token.startsWith('ctx:');

const splitClassTokens = (raw) => {
  const tokens = [];
  let current = '';
  let depth = 0;
  let bracketDepth = 0;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === '(') { depth++; current += ch; continue; }
    if (ch === ')') { depth = Math.max(0, depth - 1); current += ch; continue; }
    if (ch === '[') { bracketDepth++; current += ch; continue; }
    if (ch === ']') { bracketDepth = Math.max(0, bracketDepth - 1); current += ch; continue; }
    if (/\s/.test(ch) && depth === 0 && bracketDepth === 0) {
      if (current) { tokens.push(current); current = ''; }
      continue;
    }
    current += ch;
  }
  if (current) tokens.push(current);
  return tokens;
};

const walk = (dir, out=[]) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      out.push(full);
    }
  }
  return out;
};

const classRegexes = [
  /\bclass\s*=\s*"([^"]*)"/g,
  /\bclass\s*=\s*'([^']*)'/g,
  /\bclassName\s*=\s*"([^"]*)"/g,
  /\bclassName\s*=\s*'([^']*)'/g,
  /\bclassName\s*=\s*\{\s*`([\s\S]*?)`\s*\}/g,
];

const results = [];
let total = 0;
let failed = 0;

for (const file of walk(docsRoot)) {
  const content = fs.readFileSync(file, 'utf8');
  for (const regex of classRegexes) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const rawValue = match[1] || '';
      const classList = splitClassTokens(rawValue.trim()).filter(Boolean);
      if (classList.length === 0) continue;

      const before = content.slice(0, match.index);
      const lineNumber = before.split('\n').length;

      for (const token of classList) {
        total++;
        if (!token || isBreakpointToken(token) || isEnvToken(token) || isCtxToken(token)) continue;
        if (token.startsWith('-')) continue; // extend flag
        try {
          const ast = elevateCompiler(token, { fileName: file, lineNumber });
          if (!ast) throw new Error('Unable to parse token');
        } catch (err) {
          failed++;
          results.push({ file, lineNumber, token, error: String(err?.message || err) });
        }
      }
    }
  }
}

if (results.length) {
  const grouped = new Map();
  for (const r of results) {
    const key = `${r.file}:${r.lineNumber}`;
    const list = grouped.get(key) || [];
    list.push(r);
    grouped.set(key, list);
  }
  for (const [key, list] of grouped.entries()) {
    console.log(`\n${key}`);
    list.forEach((r) => {
      console.log(`  ${r.token}`);
      console.log(`    ${r.error}`);
    });
  }
}

console.log(`\nChecked ${total} tokens from docs. Errors: ${failed}.`);

process.exit(failed ? 1 : 0);
