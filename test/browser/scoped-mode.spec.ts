// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Revision } from './support/dev-page';
import { expect, test } from './support/fixtures';

// A mode class on any element redraws its subtree in that mode, in whatever revision is in effect
// around it, without a revision class of its own.

const container = { light: 'rgb(255, 255, 255)', dark: 'rgb(30, 32, 35)' };

for (const revision of ['2026.1', '2026.2'] satisfies Revision[]) {
  test(`a mode class alone flips the colors in ${revision}`, async ({ devPage }) => {
    await devPage.open('style-scope/side-by-side', { mode: 'light', revision });
    const colors = await devPage.content.evaluate(main => {
      const probe = (className: string, parent: Element) => {
        const element = document.createElement('div');
        element.className = className;
        const inner = document.createElement('span');
        inner.style.color = 'var(--ord-color-background-container)';
        element.appendChild(inner);
        parent.appendChild(element);
        const color = getComputedStyle(inner).color;
        return { element, color };
      };
      const dark = probe('ord-dark-mode', main);
      const lightInsideDark = probe('ord-light-mode', dark.element);
      const result = { dark: dark.color, lightInsideDark: lightInsideDark.color };
      dark.element.remove();
      return result;
    });
    expect(colors).toEqual({ dark: container.dark, lightInsideDark: container.light });
  });
}
