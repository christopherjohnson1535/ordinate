// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export enum Mode {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

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
 * Turns off component animations, on top of the user's reduced-motion setting.
 */
export function disableMotion(disabled: boolean, target: Element = document.body): void {
  target.classList.toggle('ord-motion-disabled', disabled);
}
