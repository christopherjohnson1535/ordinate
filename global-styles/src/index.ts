// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export enum Mode {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

export enum Density {
  Comfortable = 'comfortable',
  Compact = 'compact',
}

/**
 * The voice of a page. `console` is the default for applications; the others are for websites.
 */
export enum Style {
  Console = 'console',
  Editorial = 'editorial',
  Studio = 'studio',
  Shopfront = 'shopfront',
}

const styleClassPrefix = 'ord-style-';

// Keep in sync with the revisions exported from style-dictionary/index.ts.
export enum Revision {
  V2026_1 = '2026.1',
  V2026_2 = '2026.2',
}

const modeClassNames: Record<Mode, string> = {
  [Mode.Light]: 'ord-light-mode',
  [Mode.Dark]: 'ord-dark-mode',
  [Mode.System]: 'ord-system-mode',
};

const revisionClassPrefix = 'ord-revision-';

function isSupported<T extends Record<string, string>>(values: T, value: string): value is T[keyof T] {
  return Object.values(values).includes(value);
}

/**
 * Sets light, dark or system mode on `target`. Passing `null` returns to the default, light.
 */
export function applyMode(mode: Mode | null, target: Element = document.body): void {
  if (mode && !isSupported(Mode, mode)) {
    console.warn(`[ordinate] Mode "${mode}" is not supported.`);
    return;
  }
  for (const [value, className] of Object.entries(modeClassNames)) {
    target.classList.toggle(className, value === mode);
  }
}

/**
 * Pins every component inside `target` to one design revision. Passing `null`
 * returns to the default, the oldest supported revision.
 */
export function applyRevision(revision: Revision | null, target: Element = document.body): void {
  if (revision && !isSupported(Revision, revision)) {
    console.warn(`[ordinate] Revision "${revision}" is not supported.`);
    return;
  }
  for (const className of Array.from(target.classList)) {
    if (className.startsWith(revisionClassPrefix)) {
      target.classList.remove(className);
    }
  }
  if (revision) {
    target.classList.add(`${revisionClassPrefix}${revision.replace(/\./g, '-')}`);
  }
}

/**
 * Sets comfortable or compact density on `target`. Compact tightens padding and
 * control heights. Passing `null` returns to the default, comfortable.
 */
export function applyDensity(density: Density | null, target: Element = document.body): void {
  if (density && !isSupported(Density, density)) {
    console.warn(`[ordinate] Density "${density}" is not supported.`);
    return;
  }
  target.classList.toggle('ord-compact-mode', density === Density.Compact);
}

/**
 * Sets the style of every component inside `target`: `console` for applications, or
 * `editorial`, `studio` or `shopfront` for websites. A style sits on top of the pinned
 * revision. Passing `null` or `console` returns to the default.
 */
export function applyStyle(style: Style | null, target: Element = document.body): void {
  if (style && !isSupported(Style, style)) {
    console.warn(`[ordinate] Style "${style}" is not supported.`);
    return;
  }
  for (const className of Array.from(target.classList)) {
    if (className.startsWith(styleClassPrefix)) {
      target.classList.remove(className);
    }
  }
  if (style && style !== Style.Console) {
    target.classList.add(`${styleClassPrefix}${style}`);
  }
}

/**
 * Turns off component animations, on top of the user's reduced-motion setting.
 */
export function disableMotion(disabled: boolean, target: Element = document.body): void {
  target.classList.toggle('ord-motion-disabled', disabled);
}
