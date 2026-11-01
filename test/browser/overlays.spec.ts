// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Locator, Page } from '@playwright/test';

import { Direction } from './support/dev-page';
import { expect, test } from './support/fixtures';

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

async function boxOf(locator: Locator): Promise<Box> {
  const box = await locator.boundingBox();
  expect(box, 'element has no layout box').not.toBeNull();
  return box!;
}

async function expectInViewport(page: Page, locator: Locator) {
  const box = await boxOf(locator);
  const viewport = page.viewportSize()!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
}

const directions: Direction[] = ['ltr', 'rtl'];

for (const direction of directions) {
  test.describe(`in ${direction}`, () => {
    test('popovers at the edges of the page open on the side that has room', async ({ devPage, page }) => {
      await devPage.open('popover/simple', { direction });

      for (const name of ['Start edge', 'End edge']) {
        const trigger = devPage.content.getByRole('button', { name });
        await trigger.click();
        const popover = page.getByRole('dialog', { name: 'Flipped' });
        await expect(popover).toBeVisible();
        await expectInViewport(page, popover);

        const triggerBox = await boxOf(trigger);
        const popoverBox = await boxOf(popover);
        const overlapsTrigger =
          popoverBox.x < triggerBox.x + triggerBox.width && triggerBox.x < popoverBox.x + popoverBox.width;
        expect(overlapsTrigger, `${name} popover covers its trigger`).toBe(false);

        await page.keyboard.press('Escape');
        await expect(popover).toBeHidden();
      }
    });

    test('tooltips at the edges of the page stay in the viewport', async ({ devPage, page }) => {
      await devPage.open('tooltip/simple', { direction });

      for (const name of ['Start edge', 'End edge']) {
        await devPage.content.getByRole('button', { name }).focus();
        const tooltip = page.getByRole('tooltip');
        await expect(tooltip).toBeVisible();
        await expectInViewport(page, tooltip);

        await page.keyboard.press('Escape');
        await expect(tooltip).toBeHidden();
      }
    });
  });
}

test('a select near the bottom of the viewport opens above its trigger', async ({ devPage, page }) => {
  await devPage.open('select/simple');
  const trigger = devPage.content.getByRole('button', { name: /^Near the bottom/ });
  await trigger.evaluate(element => element.scrollIntoView({ block: 'end' }));

  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  const listbox = page.getByRole('listbox');
  await expect(listbox).toBeVisible();

  // The list scrolls inside its parent, so the parent is what the user sees.
  const visibleList = listbox.locator('..');
  await expectInViewport(page, visibleList);
  const listBox = await boxOf(visibleList);
  const triggerBox = await boxOf(trigger);
  expect(listBox.y + listBox.height).toBeLessThanOrEqual(triggerBox.y + 1);

  await page.keyboard.press('Escape');
  await expect(listbox).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('a popover returns focus to its trigger when closed with Escape', async ({ devPage, page }) => {
  await devPage.open('popover/simple');
  const trigger = devPage.content.getByRole('button', { name: '512 MiB of memory' });

  await trigger.focus();
  await page.keyboard.press('Enter');
  const popover = page.getByRole('dialog', { name: 'Memory' });
  await expect(popover).toBeVisible();
  await expect(popover).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(popover).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('a modal keeps focus inside and returns it to the opener when closed', async ({ devPage, page }) => {
  await devPage.open('modal/simple');
  const opener = devPage.content.getByRole('button', { name: 'Default', exact: true });

  await opener.focus();
  await page.keyboard.press('Enter');
  const modal = page.getByRole('dialog', { name: 'Delete north-annex?' });
  await expect(modal).toBeVisible();

  // A native modal dialog lets Tab reach the browser's own controls (the body, from the page's
  // view) between rounds, but never the page behind the dialog.
  for (let step = 0; step < 5; step++) {
    await page.keyboard.press('Tab');
    const focusIsTrapped = await modal.evaluate(
      dialog => document.activeElement === document.body || dialog.contains(document.activeElement)
    );
    expect(focusIsTrapped, `focus left the modal after ${step + 1} Tab presses`).toBe(true);
  }

  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(devPage.content.getByText('Last dismissed by: keyboard')).toBeVisible();

  await page.keyboard.press('Enter');
  await expect(modal).toBeVisible();
  await modal.getByRole('button', { name: 'Cancel' }).click();
  await expect(modal).toBeHidden();
  await expect(opener).toBeFocused();
});
