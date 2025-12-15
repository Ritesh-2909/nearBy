#!/usr/bin/env node

/**
 * Pre-build validation script for backend
 * Checks syntax of all JavaScript files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const errors = [];
const warnings = [];

function checkFile(filePath) {
  try {
    // Use node's syntax checker
    execSync(`node -c "${filePath}"`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    errors.push(`Syntax error in ${filePath}: ${error.message}`);
    return false;
  }
}

function findJSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules') {
      findJSFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

console.log('🔍 Running backend checks...\n');

// Check all JavaScript files
const jsFiles = findJSFiles(__dirname + '/..');
let passed = 0;
let failed = 0;

jsFiles.forEach(file => {
  if (checkFile(file)) {
    passed++;
  } else {
    failed++;
  }
});

console.log(`\n📊 Results:`);
console.log(`   ✓ Passed: ${passed}`);
if (failed > 0) {
  console.log(`   ✗ Failed: ${failed}`);
  errors.forEach(error => console.log(`   ${error}`));
}

// Check if .env file exists (warn only)
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  warnings.push('⚠️  Warning: .env file not found. Make sure to create it from .env.example');
}

if (warnings.length > 0) {
  warnings.forEach(warning => console.log(`   ${warning}`));
}

if (failed > 0) {
  console.log('\n❌ Build checks failed! Please fix the errors above.');
  process.exit(1);
}

console.log('\n✅ All backend checks passed!');
process.exit(0);

