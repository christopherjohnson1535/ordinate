// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { findAxeViolations } from './support/axe';
import { expect, test } from './support/fixtures';

// The phase 5 gate: a five-step wizard with guided help.

test.beforeEach(async ({ devPage }) => {
  await devPage.open('examples/launch-wizard');
});

test('walks through all five steps, skipping the optional ones, and launches', async ({ devPage }) => {
  const page = devPage.content;
  const next = page.getByRole('button', { name: 'Next', exact: true });

  await next.click();
  await expect(page.getByText('Use lowercase letters, numbers and hyphens.')).toBeVisible();
  await page.getByRole('textbox', { name: 'Project name' }).fill('north-annex');
  await next.click();

  await expect(page.getByRole('heading', { name: 'Choose where it runs' })).toBeFocused();
  await next.click();
  await expect(page.getByText('Choose a region.')).toBeVisible();
  await page.getByRole('button', { name: /^Region/ }).click();
  await page.getByRole('option', { name: /eu-west-1/ }).click();
  await page.getByRole('radio', { name: /Reserved/ }).check();
  await next.click();

  await expect(page.getByRole('heading', { name: 'Configure networking' })).toBeVisible();
  await page.getByRole('button', { name: /Skip to/ }).click();

  await expect(page.getByRole('heading', { name: 'Review and launch' })).toBeVisible();
  await expect(page.getByText('eu-west-1')).toBeVisible();
  await expect(page.getByText('Reserved', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Launch project' }).click();
  await expect(page.getByText('north-annex is launching')).toBeVisible();
});

test('runs the guided tutorial from the help panel', async ({ devPage, page }) => {
  const content = devPage.content;
  await content.getByRole('button', { name: 'Start tutorial' }).click();

  const annotation = page.getByRole('dialog', { name: /Name the project/ });
  await expect(annotation).toBeVisible();
  await expect(annotation.getByText('Enter a name before you go on.')).toBeVisible();

  await content.getByRole('textbox', { name: 'Project name' }).fill('north-annex');
  await expect(page.getByText('Enter a name before you go on.')).toBeHidden();
});

test('has no accessibility violations with the tutorial running', async ({ devPage }) => {
  const content = devPage.content;
  await content.getByRole('button', { name: 'Start tutorial' }).click();
  await expect(content.page().getByRole('dialog', { name: /Name the project/ })).toBeVisible();
  expect(await findAxeViolations(content)).toEqual([]);
});

test('has no accessibility violations in dark, 2026.2, compact, right to left', async ({ devPage }) => {
  await devPage.open('examples/launch-wizard', {
    mode: 'dark',
    revision: '2026.2',
    density: 'compact',
    direction: 'rtl',
  });
  const content = devPage.content;
  await content.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(content.getByText('Use lowercase letters, numbers and hyphens.')).toBeVisible();
  expect(await findAxeViolations(content)).toEqual([]);
});
