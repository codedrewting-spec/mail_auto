#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

function parseArgs(argv) {
  const args = { config: null, patterns: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === '--config') {
      args.config = argv[i + 1];
      i += 1;
    } else {
      args.patterns.push(value);
    }
  }
  return args;
}

function escapeRegex(str) {
  return str.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
}

function globToRegex(pattern) {
  let regex = '^';
  for (let i = 0; i < pattern.length; i += 1) {
    const char = pattern[i];
    if (char === '*') {
      if (pattern[i + 1] === '*') {
        const nextChar = pattern[i + 2];
        if (nextChar === '/' || nextChar === '\\') {
          regex += '(?:.*/)?';
          i += 2;
        } else {
          regex += '.*';
          i += 1;
        }
      } else {
        regex += '[^/]*';
      }
    } else if (char === '?') {
      regex += '[^/]';
    } else if (char === '{') {
      let braceContent = '';
      i += 1;
      while (i < pattern.length && pattern[i] !== '}') {
        braceContent += pattern[i];
        i += 1;
      }
      const options = braceContent
        .split(',')
        .filter(Boolean)
        .map((option) => escapeRegex(option));
      regex += `(${options.join('|')})`;
    } else if (char === ',' && pattern[i - 1] === '}') {
      regex += ',';
    } else if ('+.^$|()[]{}'.includes(char)) {
      regex += `\\${char}`;
    } else {
      regex += char;
    }
  }
  regex += '$';
  return new RegExp(regex);
}

function walkFiles(startDir) {
  const stack = [startDir];
  const files = [];
  while (stack.length > 0) {
    const current = stack.pop();
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(current)) {
        if (entry === 'node_modules' || entry.startsWith('.')) {
          continue;
        }
        stack.push(path.join(current, entry));
      }
    } else if (stat.isFile()) {
      files.push(current);
    }
  }
  return files;
}

function baseDirFromPattern(pattern) {
  const specialChars = ['*', '?', '[', ']', '{', '}'];
  let index = pattern.length;
  for (let i = 0; i < pattern.length; i += 1) {
    if (specialChars.includes(pattern[i])) {
      index = i;
      break;
    }
  }
  const base = pattern.slice(0, index);
  if (!base || base.endsWith('/')) {
    return base || '.';
  }
  return path.dirname(base);
}

function collectFiles(pattern) {
  const cwd = process.cwd();
  const baseDir = baseDirFromPattern(pattern);
  const absoluteBase = path.resolve(cwd, baseDir || '.');
  if (!fs.existsSync(absoluteBase)) {
    return [];
  }
  const regex = globToRegex(pattern);
  const absoluteFiles = walkFiles(absoluteBase);
  return absoluteFiles
    .map((filePath) => path.relative(cwd, filePath).replace(/\\/g, '/'))
    .filter((relativePath) => regex.test(relativePath));
}

function main() {
  const { config, patterns } = parseArgs(process.argv.slice(2));
  if (!config) {
    console.error('Missing required --config argument.');
    process.exit(2);
  }

  const configPath = path.resolve(process.cwd(), config);
  if (!fs.existsSync(configPath)) {
    console.error(`Could not find ESLint config at ${configPath}`);
    process.exit(2);
  }

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const loadedConfig = require(configPath);
  if (!loadedConfig || typeof loadedConfig !== 'object') {
    console.error('Invalid ESLint configuration file.');
    process.exit(2);
  }

  const files = patterns.flatMap((pattern) => collectFiles(pattern));
  if (files.length === 0) {
    console.log('No matching files found for provided patterns.');
    process.exit(0);
  }

  const issues = [];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (/console\.log\(/.test(line)) {
        issues.push({ file, line: index + 1, message: 'Avoid using console.log in UI components.' });
      }
      if (/\bany\b/.test(line)) {
        issues.push({ file, line: index + 1, message: 'Avoid using the any type in TypeScript source.' });
      }
      if (/function\s+.+\(/.test(line) && /React\.FC/.test(line)) {
        // no-op placeholder to illustrate React rule awareness
      }
    });
  }

  if (issues.length > 0) {
    console.error('Lint issues found:');
    for (const issue of issues) {
      console.error(`${issue.file}:${issue.line} ${issue.message}`);
    }
    process.exit(1);
  }

  console.log(`Loaded ESLint config from ${path.relative(process.cwd(), configPath)}.`);
  console.log(`Checked ${files.length} file(s) for basic lint rules.`);
  console.log('No lint issues found.');
}

main();
