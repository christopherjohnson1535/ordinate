// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Locator } from '@playwright/test';

import { expect, test } from './support/fixtures';

const rowHeaders = (table: Locator) => table.getByRole('rowheader');

test.beforeEach(async ({ devPage }) => {
  await devPage.open('examples/console');
});

test('filters services with a typed property filter', async ({ devPage, page }) => {
  const table = devPage.content.getByRole('table', { name: 'Services' });
  const filter = devPage.content.getByRole('combobox', { name: 'Find services' });

  await filter.click();
  await filter.pressSequentially('Status = Running');
  await page.keyboard.press('Enter');

  await expect(devPage.content.getByText('4 of 7')).toBeVisible();
  await expect(rowHeaders(table)).toHaveText(['atrium-api', 'lobby-cache', 'north-annex-web', 'reading-room']);
  await expect(devPage.content.getByRole('button', { name: /Status.*Running/ }).first()).toBeVisible();

  await devPage.content.getByRole('button', { name: /^Remove filter/ }).click();
  await expect(devPage.content.getByText('4 of 7')).toBeHidden();
  await expect(rowHeaders(table)).toHaveCount(5);
});

test('sorts by a column and pages through the results', async ({ devPage }) => {
  const table = devPage.content.getByRole('table', { name: 'Services' });
  const nameHeader = table.getByRole('columnheader', { name: 'Name' });
  const pagination = devPage.content.getByRole('list', { name: 'Pagination' });

  await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  await expect(rowHeaders(table).first()).toHaveText('archive-batch');

  await nameHeader.getByRole('button').click();
  await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
  await expect(rowHeaders(table)).toHaveText([
    'vault-store',
    'reading-room',
    'north-annex-web',
    'lobby-cache',
    'gallery-east',
  ]);

  await pagination.getByRole('button', { name: 'Next page' }).click();
  await expect(rowHeaders(table)).toHaveText(['atrium-api', 'archive-batch']);
  await expect(pagination.getByRole('button', { name: 'Page 2 of 2' })).toHaveAttribute('aria-current', 'true');
  await expect(pagination.getByRole('button', { name: 'Next page' })).toBeDisabled();

  await table.getByRole('columnheader', { name: 'Nodes' }).getByRole('button').click();
  await expect(rowHeaders(table).first()).toHaveText('archive-batch');
});

test('changes the page size through collection preferences', async ({ devPage, page }) => {
  const table = devPage.content.getByRole('table', { name: 'Services' });
  await expect(rowHeaders(table)).toHaveCount(5);

  const trigger = devPage.content.getByRole('button', { name: 'Preferences', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('radio', { name: '10 services' }).check();
  await dialog.getByRole('button', { name: 'Confirm' }).click();

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(rowHeaders(table)).toHaveCount(7);
  await expect(devPage.content.getByRole('button', { name: 'Next page' })).toBeDisabled();
});

test('draws the schedule with row tags and opens the selected row as a detail callout', async ({ devPage }) => {
  const table = devPage.content.getByRole('table', { name: 'Services' });
  await expect(table.getByRole('columnheader', { name: 'Tag' })).toBeVisible();
  await expect(table.getByRole('cell', { name: 'S4', exact: true })).toBeVisible();

  const panel = devPage.content.getByRole('complementary', { name: 'north-annex-web' });
  await expect(panel.getByText('Detail S1')).toBeVisible();

  await table.getByRole('radio', { name: 'Select atrium-api' }).check();
  const detail = devPage.content.getByRole('complementary', { name: 'atrium-api' });
  await expect(detail.getByText('Detail S3')).toBeVisible();
  await expect(devPage.content.getByRole('button', { name: 'Restart S3' })).toBeEnabled();
});

test('closes and reopens the split panel', async ({ devPage }) => {
  const panel = devPage.content.getByRole('complementary', { name: 'north-annex-web' });
  await expect(panel).toBeVisible();

  await panel.getByRole('button', { name: 'Close panel' }).click();
  await expect(panel.getByRole('progressbar')).toBeHidden();

  const open = devPage.content.getByRole('button', { name: 'Open panel' });
  await open.click();
  await expect(panel.getByRole('progressbar', { name: 'web:v2 is rolling out' })).toBeVisible();
});

test('follows the sheet index, names the sheet in the title block and reaches the command line with /', async ({
  devPage,
  page,
}) => {
  const titleBlock = devPage.content.locator('dl[aria-label="Sheet"]');
  await expect(titleBlock).toContainText('A-02 Services');

  const billing = devPage.content.getByRole('link', { name: 'B-02 Billing' });
  await billing.click();
  await expect(billing).toHaveAttribute('aria-current', 'page');
  await expect(titleBlock).toContainText('B-02 Billing');

  await page.locator('body').click({ position: { x: 1, y: 1 } });
  await page.keyboard.press('/');
  await expect(devPage.content.getByRole('searchbox', { name: 'Command line' })).toBeFocused();
});
