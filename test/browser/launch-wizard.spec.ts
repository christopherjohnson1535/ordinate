// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { findAxeViolations } from './support/axe';
import { expect, test } from './support/fixtures';

// The phase 5 gate: a launch checklist with guided help.

test.beforeEach(async ({ devPage }) => {
  await devPage.open('examples/launch-wizard');
});

test('fills in the checklist, skipping the optional items, and launches', async ({ devPage }) => {
  const page = devPage.content;
  const next = page.getByRole('button', { name: 'Next', exact: true });
  const launch = page.getByRole('button', { name: 'Launch project' });
  await expect(launch).toBeDisabled();

  await next.click();
  await expect(page.getByText('Use lowercase letters, numbers and hyphens.')).toBeVisible();
  await expect(page.getByText('Enter a valid project name before you launch.')).toBeVisible();
  await expect(page.getByText('△1 open').first()).toBeVisible();
  await page.getByRole('textbox', { name: 'Project name' }).fill('north-annex');
  await next.click();

  await expect(page.getByRole('heading', { name: 'Choose where it runs' })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Change Describe the project' })).toBeVisible();
  await next.click();
  await expect(page.getByText('Choose a region.')).toBeVisible();
  await page.getByRole('button', { name: /^Region/ }).click();
  await page.getByRole('option', { name: /eu-west-1/ }).click();
  await page.getByRole('radio', { name: /Reserved/ }).check();
  await next.click();

  await expect(page.getByRole('heading', { name: 'Configure networking' })).toBeVisible();
  // The status line's live announcer can hold the same words, so match the visible line.
  await expect(page.getByText('2 of 2 required items checked').first()).toBeVisible();
  await expect(page.getByText('eu-west-1 · Reserved')).toBeVisible();
  await expect(page.getByText('eu-west-1', { exact: true }).first()).toBeVisible();

  await launch.click();
  await expect(page.getByText('north-annex is launching')).toBeVisible();
});

test('opens items in any order and circles an item left with a problem', async ({ devPage }) => {
  const page = devPage.content;
  const launch = page.getByRole('button', { name: 'Launch project' });
  await page.getByRole('button', { name: 'Open Choose where it runs' }).click();
  await expect(page.getByRole('heading', { name: 'Choose where it runs' })).toBeFocused();

  const first = page.getByRole('group', { name: 'Describe the project' });
  await expect(first).toHaveAccessibleDescription(/Enter a valid project name before you launch/);
  await expect(launch).toBeDisabled();

  await page.getByRole('button', { name: /^Region/ }).click();
  await page.getByRole('option', { name: /us-east-2/ }).click();
  await first.getByRole('button', { name: 'Change Describe the project' }).click();
  await expect(page.getByRole('heading', { name: 'Describe the project' })).toBeFocused();
  await page.getByRole('textbox', { name: 'Project name' }).fill('north-annex');

  await expect(page.getByText('us-east-2 · Standard')).toBeVisible();
  await expect(launch).toBeEnabled();
  await launch.click();
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
