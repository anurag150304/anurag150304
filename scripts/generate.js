import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Mustache from 'mustache';

// Disable HTML entity escaping for Markdown output
Mustache.escape = (text) => text;


import { mergeData } from './merge.js';
import { fetchGitHubStats } from './github.js';
import { processProjects } from './projects.js';
import { fetchLatestActivity } from './activity.js';
import { fetchLatestBlogPosts } from './blog.js';
import { getRandomQuote } from './quote.js';
import { fetchCodingStats } from './coding.js';
import { ensureDirExists } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const GENERATED_DIR = path.join(ROOT_DIR, 'generated');
const OUTPUT_README_PATH = path.join(ROOT_DIR, 'README.md');
const PRIMARY_MUSTACHE_PATH = path.join(ROOT_DIR, 'README.mustache');

async function main() {
  console.log('Starting GitHub Profile README Generation Pipeline...');

  // 1. Merge static JSON datasets
  const mergedStaticData = mergeData();
  const username = mergedStaticData.profile?.username || 'anurag150304';

  console.log(`Fetching live metadata for user @${username}...`);

  // 2. Fetch dynamic metadata in parallel
  const [githubStats, activityEvents, blogPosts, codingStats] = await Promise.all([
    fetchGitHubStats(username),
    fetchLatestActivity(username),
    fetchLatestBlogPosts(process.env.BLOG_RSS_URL || ''),
    fetchCodingStats()
  ]);

  // 3. Process projects
  const processedProjects = processProjects(mergedStaticData.projects);

  // 4. Select developer quote
  const quoteObj = getRandomQuote(mergedStaticData.funfacts?.quotes);

  // 5. Assemble unified profile data context
  const fullProfileData = {
    ...mergedStaticData,
    github: githubStats,
    projects: processedProjects,
    activity: activityEvents,
    blog: blogPosts,
    quote: quoteObj,
    coding: codingStats,
    lastUpdated: new Date().toUTCString(),
    generatedYear: new Date().getFullYear()
  };

  // Save generated profileData.json artifact
  ensureDirExists(GENERATED_DIR);
  const profileDataPath = path.join(GENERATED_DIR, 'profileData.json');
  fs.writeFileSync(profileDataPath, JSON.stringify(fullProfileData, null, 2), 'utf-8');
  console.log(`Saved consolidated runtime data to ${profileDataPath}`);

  // 6. Load Mustache template partials
  const partialNames = [
    'header',
    'about',
    'skills',
    'blog',
    'contact',
    'footer'
  ];


  const partials = {};
  partialNames.forEach(name => {
    const partialPath = path.join(TEMPLATES_DIR, `${name}.mustache`);
    if (fs.existsSync(partialPath)) {
      partials[name] = fs.readFileSync(partialPath, 'utf-8');
    } else {
      console.warn(`[generate] Warning: Partial template not found: ${partialPath}`);
    }
  });

  // 7. Load main template (templates/main.mustache or README.mustache)
  let mainTemplate = '';
  const mainTemplatePath = path.join(TEMPLATES_DIR, 'main.mustache');

  if (fs.existsSync(mainTemplatePath)) {
    mainTemplate = fs.readFileSync(mainTemplatePath, 'utf-8');
  } else if (fs.existsSync(PRIMARY_MUSTACHE_PATH)) {
    mainTemplate = fs.readFileSync(PRIMARY_MUSTACHE_PATH, 'utf-8');
  } else {
    throw new Error('No main mustache template found in templates/main.mustache or README.mustache');
  }

  // Also sync README.mustache with templates/main.mustache if both exist or keep updated
  fs.writeFileSync(PRIMARY_MUSTACHE_PATH, mainTemplate, 'utf-8');

  // 8. Render template using Mustache
  console.log('Rendering README markdown from Mustache template...');
  const outputMarkdown = Mustache.render(mainTemplate, fullProfileData, partials);

  // 9. Write to root README.md
  fs.writeFileSync(OUTPUT_README_PATH, outputMarkdown, 'utf-8');
  console.log(`README.md successfully generated at ${OUTPUT_README_PATH}!`);
}

main().catch(err => {
  console.error('Fatal error generating README.md:', err);
  process.exit(1);
});
