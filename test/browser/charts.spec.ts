// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { findAxeViolations } from './support/axe';
import { DevPageSettings } from './support/dev-page';
import { expect, test } from './support/fixtures';

// The phase 6 gate: charts read in light, dark and every revision. Each combination renders
// every chart, tells its series apart by pattern as well as color, and passes axe.

const combinations: Array<[string, DevPageSettings]> = [
  ['light, 2026.1', { mode: 'light', revision: '2026.1' }],
  ['dark, 2026.1', { mode: 'dark', revision: '2026.1' }],
  ['light, 2026.2', { mode: 'light', revision: '2026.2' }],
  ['dark, 2026.2', { mode: 'dark', revision: '2026.2' }],
];

for (const [name, settings] of combinations) {
  test(`every chart reads in ${name}`, async ({ devPage }) => {
    await devPage.open('charts/overview', settings);
    const plots = devPage.content.locator('[role="application"]');
    await expect(plots.first()).toBeVisible();
    expect(await plots.count()).toBeGreaterThanOrEqual(5);

    // Series are told apart by fill patterns, not only by color, so they survive grayscale and print.
    const patternIds = await devPage.content
      .locator('pattern')
      .evaluateAll(patterns => new Set(patterns.map(pattern => pattern.innerHTML)).size);
    expect(patternIds).toBeGreaterThanOrEqual(4);

    // Axis tick labels must be readable against the sheet in this mode.
    expect(await findAxeViolations(devPage.content)).toEqual([]);
  });
}

test('the line chart can be read with the keyboard', async ({ devPage, page }) => {
  await devPage.open('line-chart/permutations');
  const plot = devPage.content.locator('[role="application"]').first();
  await plot.focus();
  await page.keyboard.press('ArrowRight');
  // Enter pins the details for the focused position as a dialog and moves focus into it.
  await page.keyboard.press('Enter');
  const details = page.getByRole('dialog');
  await expect(details).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(details).toBeHidden();
  await expect(plot).toBeFocused();
});
