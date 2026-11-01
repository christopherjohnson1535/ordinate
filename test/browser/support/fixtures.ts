// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { test as base } from '@playwright/test';

import { DevPage } from './dev-page';

interface TestFixtures {
  /** A fresh browser page for this test, wrapped in the dev shell helper. */
  devPage: DevPage;
}

interface WorkerFixtures {
  /**
   * One dev shell page that the tests in a worker share. Loading the shell takes about two seconds,
   * while switching to another page inside it is nearly instant, so read-only checks that visit
   * every page use this one. Tests that change a page's state should use `devPage`.
   */
  sharedDevPage: DevPage;
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  devPage: async ({ page }, use) => {
    await use(new DevPage(page));
  },
  sharedDevPage: [
    async ({ browser }, use, workerInfo) => {
      const { baseURL, viewport, reducedMotion } = workerInfo.project.use;
      const context = await browser.newContext({ baseURL, viewport, reducedMotion });
      await use(new DevPage(await context.newPage()));
      await context.close();
    },
    { scope: 'worker' },
  ],
});

export { expect } from '@playwright/test';
