// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Page } from '@playwright/test';

import { DevPageSettings } from './support/dev-page';
import { expect, test } from './support/fixtures';

// The inputs give way to any width, so they once followed the months alone and a time field shrank to a sliver.
// Each one must show its whole value, or its whole placeholder when it is empty.
async function measureInputs(page: Page) {
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('textbox', { name: 'Start time' })).toBeVisible();
  return dialog.getByRole('textbox').evaluateAll(inputs =>
    (inputs as HTMLInputElement[]).map(input => {
      const value = input.value;
      input.value = value || input.placeholder;
      const fits = input.scrollWidth <= input.clientWidth;
      input.value = value;
      return { name: input.labels?.[0]?.textContent ?? input.id, text: value || input.placeholder, fits };
    })
  );
}

const cases: { title: string; settings: DevPageSettings; width: number }[] = [
  { title: 'two months', settings: {}, width: 1400 },
  { title: 'two months, right to left', settings: { direction: 'rtl' }, width: 1400 },
  { title: 'two months, compact', settings: { density: 'compact' }, width: 1400 },
  { title: 'one month', settings: {}, width: 640 },
  { title: 'one month, right to left', settings: { direction: 'rtl' }, width: 640 },
  { title: 'one month, compact', settings: { density: 'compact' }, width: 640 },
];

for (const { title, settings, width } of cases) {
  test(`absolute inputs show their whole value with ${title}`, async ({ devPage, page }) => {
    await page.setViewportSize({ width, height: 900 });
    await devPage.open('date-range-picker/permutations', settings);

    for (const label of ['Absolute range', 'Log window']) {
      await devPage.content.getByRole('button', { name: new RegExp(`^${label}`) }).click();
      const absolute = page.getByRole('dialog').getByText('Absolute range', { exact: true });
      if (label === 'Log window') {
        await absolute.click();
      }
      const inputs = await measureInputs(page);
      expect(inputs.map(input => input.name)).toEqual(['Start date', 'Start time', 'End date', 'End time']);
      for (const input of inputs) {
        expect(input.fits, `${label}: ${input.name} shows "${input.text}"`).toBe(true);
      }
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toBeHidden();
    }
  });
}
