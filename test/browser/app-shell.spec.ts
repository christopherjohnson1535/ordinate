// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { expect, test } from './support/fixtures';

test.beforeEach(async ({ devPage }) => {
  await devPage.open('examples/app-shell');
});

test('restarts the project and reports progress, then success', async ({ devPage }) => {
  const shell = devPage.content;
  const notifications = shell.getByRole('list', { name: 'Notifications' });
  const status = shell.getByRole('definition').filter({ hasText: /Running|Restarting/ });

  await shell.getByRole('button', { name: 'Actions' }).click();
  await shell.getByRole('menuitem', { name: 'Restart' }).click();

  await expect(notifications.getByText('Restarting north-annex')).toBeVisible();
  await expect(status).toHaveText('Restarting');
  await shell.getByRole('button', { name: 'Actions' }).click();
  await expect(shell.getByRole('menuitem', { name: 'Restart' })).toBeDisabled();
  await shell.page().keyboard.press('Escape');

  await expect(notifications.getByText('north-annex restarted')).toBeVisible({ timeout: 5000 });
  await expect(notifications.getByText('Restarting north-annex')).toBeHidden();
  await expect(status).toHaveText('Running');
});

test('dismisses notifications', async ({ devPage }) => {
  const notifications = devPage.content.getByRole('list', { name: 'Notifications' });
  await expect(notifications.getByRole('listitem')).toHaveCount(1);

  await notifications.getByRole('button', { name: 'Dismiss' }).click();
  await expect(notifications.getByRole('listitem')).toHaveCount(0);
});

test('switches tabs by click and by keyboard, but not to the disabled tab', async ({ devPage, page }) => {
  const shell = devPage.content;
  const tab = (name: string) => shell.getByRole('tab', { name });

  await tab('Activity').click();
  await expect(tab('Activity')).toHaveAttribute('aria-selected', 'true');
  await expect(shell.getByRole('tabpanel', { name: 'Activity' })).toContainText('Node 14 replaced');

  await page.keyboard.press('ArrowRight');
  await expect(tab('Connect')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(shell.getByRole('tabpanel', { name: 'Connect' })).toContainText('ordinate login');

  // A disabled tab still takes focus so its reason can be read, but it does not open.
  await page.keyboard.press('ArrowRight');
  await expect(tab('Logs')).toBeFocused();
  await expect(tab('Logs')).toHaveAccessibleDescription('Logs are turned off for this project.');
  await page.keyboard.press('Enter');
  await expect(tab('Connect')).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('Home');
  await expect(tab('Details')).toBeFocused();
});

test('opens the user menu in the top navigation with the keyboard', async ({ devPage, page }) => {
  const shell = devPage.content;
  const trigger = shell.getByRole('button', { name: /Dana Ruiz/ });

  await trigger.focus();
  await page.keyboard.press('Enter');
  const menu = shell.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  await expect(menu.getByRole('menuitem', { name: 'Profile' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Preferences' })).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(menu.getByRole('menuitem', { name: 'Sign out' })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});
