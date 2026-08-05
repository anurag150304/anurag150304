import path from 'path';
import { fileURLToPath } from 'url';
import { readJsonFile } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * Merges all JSON files from data/ directory into a unified object.
 * @returns {object} Merged data dictionary
 */
export function mergeData() {
  const profile = readJsonFile(path.join(DATA_DIR, 'profile.json')) || {};
  const projects = readJsonFile(path.join(DATA_DIR, 'projects.json')) || [];
  const social = readJsonFile(path.join(DATA_DIR, 'social.json')) || {};
  const skills = readJsonFile(path.join(DATA_DIR, 'skills.json')) || {};
  const learning = readJsonFile(path.join(DATA_DIR, 'learning.json')) || {};
  const experience = readJsonFile(path.join(DATA_DIR, 'experience.json')) || [];
  const funfacts = readJsonFile(path.join(DATA_DIR, 'funfacts.json')) || {};

  return {
    profile,
    projects,
    social,
    skills,
    learning,
    experience,
    funfacts
  };
}
