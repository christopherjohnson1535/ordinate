// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import { expect, Locator, Page } from '@playwright/test';

export type Mode = 'light' | 'dark' | 'system';
export type Revision = '2026.1' | '2026.2';
export type Density = 'comfortable' | 'compact';
export type Direction = 'ltr' | 'rtl';

export interface DevPageSettings {
  mode?: Mode;
  revision?: Revision;
  density?: Density;
  direction?: Direction;
}

/**
 * Drives the dev pages shell: opens a page by its route and sets mode, revision, density and
 * direction through the top bar, the same way a person checking a page would.
 */
export class DevPage {
  readonly topBar: Locator;
  /** The sheet that holds the page itself, without the shell's navigation and top bar. */
  readonly content: Locator;

  constructor(readonly page: Page) {
    this.topBar = page.getByRole('banner').filter({ has: page.getByRole('group', { name: 'Mode' }) });
    this.content = page.locator('#app main').first();
  }

  /** Opens a dev page by its route, `group/name`, for example `examples/settings-form`. */
  async open(route: string, settings: DevPageSettings = {}) {
    if (await this.topBar.isVisible()) {
      await this.page.evaluate(hash => (window.location.hash = hash), route);
    } else {
      await this.page.goto(`/#${route}`);
    }
    await expect(this.topBar.getByText(route, { exact: true })).toBeVisible();
    await this.apply(settings);
  }

  async apply({ mode, revision, density, direction }: DevPageSettings) {
    if (mode) {
      await this.setMode(mode);
    }
    if (revision) {
      await this.setRevision(revision);
    }
    if (density) {
      await this.setDensity(density);
    }
    if (direction) {
      await this.setDirection(direction);
    }
  }

  async setMode(mode: Mode) {
    await this.pressSegment('Mode', mode);
    await expect(this.page.locator('body')).toHaveClass(new RegExp(`\\bord-${mode}-mode\\b`));
  }

  async setRevision(revision: Revision) {
    await this.pressSegment('Revision', revision);
    await expect(this.page.locator('body')).toHaveClass(new RegExp(`\\bord-revision-${revision.replace('.', '-')}\\b`));
  }

  async setDensity(density: Density) {
    await this.topBar.getByRole('combobox', { name: 'Density' }).selectOption(density);
    const compact = /\bord-compact-mode\b/;
    if (density === 'compact') {
      await expect(this.page.locator('body')).toHaveClass(compact);
    } else {
      await expect(this.page.locator('body')).not.toHaveClass(compact);
    }
  }

  async setDirection(direction: Direction) {
    await this.topBar.getByRole('combobox', { name: 'Direction' }).selectOption(direction);
    await expect(this.page.locator('html')).toHaveAttribute('dir', direction);
  }

  private async pressSegment(group: string, option: string) {
    const button = this.topBar.getByRole('group', { name: group }).getByRole('button', { name: option, exact: true });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
  }
}

/** Lists every dev page route, `group/name`, from the page files the shell serves. */
export function listRoutes(): string[] {
  const pagesDir = path.join(process.cwd(), 'pages');
  return fs
    .readdirSync(pagesDir, { recursive: true, encoding: 'utf8' })
    .filter(file => file.endsWith('.page.tsx'))
    .map(file => file.split(path.sep).join('/').replace('.page.tsx', ''))
    .sort();
}
