// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { chromium, defineConfig, devices } from '@playwright/test';

const rootDir = process.cwd();
const port = Number(process.env.PAGES_PORT ?? 5190);

// The dev pages import the built components, and this config deliberately builds nothing.
if (!existsSync(path.join(rootDir, 'lib/components/index.js'))) {
  throw new Error('lib/components is missing. Run `npm run build` before `npm run test:browser`.');
}

// Prefer the browser that `npx playwright install chromium` downloads. Machines that already have
// Chromium from a global `playwright` install (or set ORDINATE_CHROMIUM) reuse that one instead.
function findChromium(): string | undefined {
  if (process.env.ORDINATE_CHROMIUM) {
    return process.env.ORDINATE_CHROMIUM;
  }
  if (existsSync(chromium.executablePath())) {
    return undefined;
  }
  try {
    const globalRoot = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
    const globalPlaywright = createRequire(path.join(globalRoot, 'noop.js'))(
      'playwright'
    ) as typeof import('@playwright/test');
    const executable = globalPlaywright.chromium.executablePath();
    return existsSync(executable) ? executable : undefined;
  } catch {
    return undefined;
  }
}

export default defineConfig({
  testDir: 'test/browser',
  outputDir: 'test-results/browser',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'test-results/browser-report', open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: `http://localhost:${port}`,
    viewport: { width: 1400, height: 900 },
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    launchOptions: { executablePath: findChromium() },
  },
  projects: [{ name: 'chromium' }],
  webServer: {
    command: `npx vite --config pages/vite.config.mjs --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
