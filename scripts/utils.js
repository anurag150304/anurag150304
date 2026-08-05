import fs from 'fs';
import path from 'path';

/**
 * Reads and parses a JSON file safely.
 * @param {string} filePath 
 * @returns {object|array|null}
 */
export function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`[utils] File not found: ${filePath}`);
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`[utils] Error reading JSON file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Ensures directory exists before writing.
 * @param {string} dirPath 
 */
export function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Formats a Date object or ISO string nicely.
 * @param {Date|string} dateInput 
 * @returns {string}
 */
export function formatDate(dateInput) {
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
