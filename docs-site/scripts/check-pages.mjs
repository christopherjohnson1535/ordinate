// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
//
// Opens pages of the docs site in a headless browser and reports anything that went wrong on them:
// uncaught errors, console errors, examples that fell back to the error message, and pages that
// resolved to "No such sheet".
//
//   node scripts/check-pages.mjs --base http://localhost:4180 /components/button /start/installation
//   node scripts/check-pages.mjs --base http://localhost:4180 --all
//   node scripts/check-pages.mjs --base http://localhost:4180 --shots ./shots --dark /components/table
//
// Set CHROME_PATH to use an installed Chrome instead of Playwright's own browser.
/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const option = name => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args.splice(index, 2)[1];
};
const flag = name => {
  const index = args.indexOf(name);
  return index === -1 ? false : (args.splice(index, 1), true);
};

const base = option('--base') ?? 'http://localhost:4180';
const shots = option('--shots');
const width = Number(option('--width') ?? 1440);
const all = flag('--all');
const dark = flag('--dark');
const fullPage = flag('--full');

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--no-sandbox'],
});
const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: dark ? 'dark' : 'light' });
const page = await context.newPage();

let errors = [];
page.on('pageerror', error => errors.push(`uncaught: ${error.message}`));
page.on('console', message => {
  if (message.type() === 'error') errors.push(`console: ${message.text()}`);
});

async function routesFromSite() {
  await page.goto(`${base}/#/`, { waitUntil: 'networkidle' });
  return page.evaluate(() => window.__ORDINATE_DOCS_ROUTES__ ?? []);
}

const routes = all ? await routesFromSite() : args;
if (!routes.length) {
  console.error('Name some routes, such as /components/button, or pass --all.');
  process.exit(2);
}
if (shots) fs.mkdirSync(shots, { recursive: true });

let failures = 0;
for (const route of routes) {
  errors = [];
  await page.goto(`${base}/#${route}`, { waitUntil: 'networkidle' });
  // Examples load after the page. Wait until none is still loading, then a moment more for what
  // the examples themselves load, such as CodeMirror or a chart's first draw.
  await page
    .waitForFunction(() => !document.querySelector('[data-example-loading]'), null, { timeout: 15000 })
    .catch(() => errors.push('examples were still loading after 15 seconds'));
  await page.waitForTimeout(500);
  const problems = await page.evaluate(() => {
    const found = [];
    if (document.title.startsWith('No such sheet')) found.push('route did not resolve');
    document.querySelectorAll('[data-example-error]').forEach(element => {
      found.push(`example failed: ${element.getAttribute('data-example-error')}`);
    });
    return found;
  });
  const all = [...problems, ...errors.filter(text => !text.includes('favicon'))];
  if (all.length) {
    failures++;
    console.log(`✗ ${route}\n  ${all.join('\n  ')}`);
  } else {
    console.log(`✓ ${route}`);
  }
  if (shots) {
    const file = path.join(
      shots,
      `${route.replace(/^\//, '').replace(/[/#]/g, '__') || 'cover'}${dark ? '-dark' : ''}.png`
    );
    await page.screenshot({ path: file, fullPage });
  }
}

await browser.close();
console.log(`\n${routes.length - failures} of ${routes.length} pages clean.`);
process.exit(failures ? 1 : 0);
