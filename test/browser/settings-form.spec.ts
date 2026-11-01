// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expect, test } from './support/fixtures';

test.beforeEach(async ({ devPage }) => {
  await devPage.open('examples/settings-form');
});

test('saves after the highlighted fields are fixed', async ({ devPage }) => {
  const form = devPage.content;
  const name = form.getByRole('textbox', { name: 'Project name' });
  const nodes = form.getByRole('spinbutton', { name: 'Nodes' });
  const save = form.getByRole('button', { name: 'Save changes' });

  await name.fill('North Annex');
  await form.getByRole('textbox', { name: 'Summary' }).fill('Staging copy of the annex.');
  await form.getByRole('button', { name: /^Region/ }).click();
  await form.getByRole('option', { name: /eu-west-1/ }).click();
  await expect(form.getByRole('button', { name: /^Region/ })).toHaveText(/eu-west-1/);
  await form.getByRole('radio', { name: 'Reserved' }).check();
  await nodes.fill('0');
  await form.getByRole('switch', { name: 'Scale automatically' }).check();
  await form.getByRole('checkbox', { name: 'Back up every night' }).uncheck();

  await save.click();
  await expect(form.getByText('Fix the highlighted fields before saving.')).toBeVisible();
  await expect(form.getByText('Use lowercase letters, numbers and hyphens.', { exact: true })).toBeVisible();
  await expect(form.getByText('Enter at least 1 node.')).toBeVisible();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(form.getByRole('alert').filter({ hasText: 'Settings saved' })).toHaveCount(0);

  await name.fill('north-annex-staging');
  await nodes.fill('4');
  await expect(name).not.toHaveAttribute('aria-invalid', 'true');
  await expect(form.getByText('Fix the highlighted fields before saving.')).toBeHidden();

  await save.click();
  const saved = form.getByText('Settings saved');
  await expect(saved).toBeVisible();
  await expect(form.getByText('New nodes will use these settings.')).toBeVisible();

  await form.getByRole('button', { name: 'Dismiss' }).click();
  await expect(saved).toBeHidden();
});

test('warns about large clusters without blocking the save', async ({ devPage }) => {
  const form = devPage.content;
  await form.getByRole('spinbutton', { name: 'Nodes' }).fill('80');
  await expect(form.getByText('Large clusters take several minutes to start.')).toBeVisible();

  await form.getByRole('button', { name: 'Save changes' }).click();
  await expect(form.getByText('Settings saved')).toBeVisible();
});

test('moves through the form with the keyboard', async ({ devPage, page }) => {
  const form = devPage.content;
  await form.getByRole('textbox', { name: 'Project name' }).focus();
  await page.keyboard.press('Tab');
  await expect(form.getByRole('textbox', { name: 'Summary' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(form.getByRole('button', { name: /^Region/ })).toBeFocused();

  await page.keyboard.press('ArrowDown');
  await expect(form.getByRole('listbox')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(form.getByRole('listbox')).toBeHidden();
  await expect(form.getByRole('button', { name: /^Region/ })).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(form.getByRole('radio', { name: 'Standard' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(form.getByRole('radio', { name: 'Reserved' })).toBeChecked();
});
