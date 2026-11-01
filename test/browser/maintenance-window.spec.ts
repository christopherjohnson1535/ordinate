// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { findAxeViolations } from './support/axe';
import { DevPageSettings } from './support/dev-page';
import { expect, test } from './support/fixtures';

// The phase 4 gate: date and file forms pass axe and browser tests.

test.beforeEach(async ({ devPage }) => {
  await devPage.open('examples/maintenance-window');
});

test('schedules once the date, time and runbook are valid', async ({ devPage, page }) => {
  const form = devPage.content;
  const schedule = form.getByRole('button', { name: 'Schedule', exact: true });

  await schedule.click();
  await expect(form.getByText('Fix the highlighted fields before scheduling.')).toBeVisible();
  await expect(form.getByText('Choose a start date.')).toBeVisible();
  await expect(form.getByText('Enter a start time as hh:mm.')).toBeVisible();

  // Typing into the masked date input inserts the separators.
  const dateInput = form.getByRole('textbox', { name: 'Start date' });
  await dateInput.pressSequentially('20261104');
  await expect(dateInput).toHaveValue('2026/11/04');

  await form.getByRole('textbox', { name: 'Start time' }).pressSequentially('0230');
  await expect(form.getByRole('textbox', { name: 'Start time' })).toHaveValue('02:30');

  const runbook = form.locator('input[type="file"]');
  await runbook.setInputFiles([
    { name: 'restart-runbook.md', mimeType: 'text/markdown', buffer: Buffer.from('# Restart\n\n1. Drain\n') },
    { name: 'huge-trace.txt', mimeType: 'text/plain', buffer: Buffer.alloc(6 * 1000 * 1000, 'a') },
  ]);
  await expect(form.getByText('restart-runbook.md')).toBeVisible();
  await expect(form.getByText('Files must be 5 MB or smaller.')).toBeVisible();

  await schedule.click();
  await expect(form.getByText('Remove the files that are too large.')).toBeVisible();

  await form.getByRole('button', { name: /Remove.*huge-trace\.txt/ }).click();
  await expect(form.getByText('huge-trace.txt')).toBeHidden();

  await schedule.click();
  await expect(form.getByText('Maintenance scheduled')).toBeVisible();
  await expect(form.getByText('Starts 2026-11-04 at 02:30 and runs for 2 hours.')).toBeVisible();
  await expect(page.getByText('Fix the highlighted fields before scheduling.')).toBeHidden();
});

test('picks a weekday from the calendar with the keyboard and skips weekends', async ({ devPage, page }) => {
  const form = devPage.content;
  const dateInput = form.getByRole('textbox', { name: 'Start date' });
  await dateInput.pressSequentially('20261106');

  await form.getByRole('button', { name: 'Choose start date' }).click();
  const grid = page.getByRole('grid');
  await expect(grid).toBeVisible();
  await expect(page.locator(':focus')).toHaveAttribute('aria-selected', 'true');

  // Friday the 6th, then one day forward lands on Saturday, which is disabled with a reason.
  await page.keyboard.press('ArrowRight');
  await expect(page.locator(':focus')).toHaveAttribute('aria-disabled', 'true');
  await page.keyboard.press('Enter');
  await expect(dateInput).toHaveValue('2026/11/06');

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(dateInput).toHaveValue('2026/11/09');
  await expect(grid).toBeHidden();
});

test('applies a relative change freeze', async ({ devPage, page }) => {
  const form = devPage.content;
  await form
    .getByRole('button', { name: /Change freeze|Choose a range/ })
    .first()
    .click();
  await page.getByRole('radio', { name: /7 days/ }).check();
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(form.getByText(/7 days/)).toBeVisible();
});

const modes: Array<[string, DevPageSettings]> = [
  ['light', { mode: 'light' }],
  ['dark', { mode: 'dark' }],
  ['dark, 2026.2, compact, right to left', { mode: 'dark', revision: '2026.2', density: 'compact', direction: 'rtl' }],
];

for (const [name, settings] of modes) {
  test(`has no accessibility violations, with errors and files shown, in ${name}`, async ({ devPage }) => {
    await devPage.open('examples/maintenance-window', settings);
    const form = devPage.content;
    await form
      .locator('input[type="file"]')
      .setInputFiles([{ name: 'restart-runbook.md', mimeType: 'text/markdown', buffer: Buffer.from('# Restart') }]);
    await form.getByRole('button', { name: 'Schedule', exact: true }).click();
    await expect(form.getByText('Choose a start date.')).toBeVisible();
    expect(await findAxeViolations(form)).toEqual([]);

    await form.getByRole('button', { name: 'Choose start date' }).click();
    await expect(form.page().getByRole('grid')).toBeVisible();
    expect(await findAxeViolations(form)).toEqual([]);
  });
}
