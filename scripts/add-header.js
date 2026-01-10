#!/usr/bin/env node

/**
 * Script to add copyright header to source files
 * Usage: node scripts/add-header.js [file1] [file2] ...
 *        node scripts/add-header.js --all (adds to all source files)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Copyright header template
const COPYRIGHT_HEADER = `/**
 * Copyright (c) 2024 jian lan
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
`;

// File extensions to process
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.scss', '.sass', '.css'];

// Directories to exclude
const EXCLUDE_DIRS = ['node_modules', 'dist', '.git', '.storybook', 'storybook-static', '.cache'];

// Files to exclude
const EXCLUDE_FILES = ['index.html', 'package.json', 'package-lock.json'];

/**
 * Check if file already has copyright header
 */
function hasHeader(content) {
  return content.trim().startsWith('/**') && content.includes('Copyright (c)');
}

/**
 * Add header to file content
 */
function addHeader(content, extension) {
  // Skip if already has header
  if (hasHeader(content)) {
    return null;
  }

  // For different file types, adjust comment style
  if (['.scss', '.sass', '.css'].includes(extension)) {
    const scssHeader = COPYRIGHT_HEADER.replace(/\/\*\*/g, '/**').replace(/\*\//g, '*/');
    return scssHeader + '\n' + content;
  }

  return COPYRIGHT_HEADER + '\n' + content;
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const extension = extname(filePath);
    
    if (!EXTENSIONS.includes(extension)) {
      return { file: filePath, status: 'skipped', reason: 'unsupported extension' };
    }

    const newContent = addHeader(content, extension);
    
    if (newContent === null) {
      return { file: filePath, status: 'skipped', reason: 'already has header' };
    }

    writeFileSync(filePath, newContent, 'utf-8');
    return { file: filePath, status: 'added' };
  } catch (error) {
    return { file: filePath, status: 'error', error: error.message };
  }
}

/**
 * Recursively get all files in directory
 */
function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      const dirName = file;
      if (!EXCLUDE_DIRS.includes(dirName) && !dirName.startsWith('.')) {
        getAllFiles(filePath, fileList);
      }
    } else if (stat.isFile()) {
      if (!EXCLUDE_FILES.includes(file)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Usage:
  node scripts/add-header.js [file1] [file2] ...
  node scripts/add-header.js --all

Options:
  --all    Add header to all source files in src/
  --help   Show this help message
`);
    process.exit(0);
  }

  let filesToProcess = [];

  if (args[0] === '--all') {
    const srcDir = join(projectRoot, 'src');
    filesToProcess = getAllFiles(srcDir);
    console.log(`Found ${filesToProcess.length} files to process...\n`);
  } else {
    filesToProcess = args.map(arg => join(process.cwd(), arg));
  }

  const results = filesToProcess.map(processFile);
  
  const added = results.filter(r => r.status === 'added');
  const skipped = results.filter(r => r.status === 'skipped');
  const errors = results.filter(r => r.status === 'error');

  console.log('Results:');
  console.log(`  ✓ Added header: ${added.length}`);
  console.log(`  ⊘ Skipped: ${skipped.length}`);
  if (errors.length > 0) {
    console.log(`  ✗ Errors: ${errors.length}`);
    errors.forEach(e => console.log(`    - ${e.file}: ${e.error}`));
  }

  if (added.length > 0) {
    console.log('\nFiles with header added:');
    added.forEach(r => console.log(`  - ${r.file}`));
  }
}

main();
