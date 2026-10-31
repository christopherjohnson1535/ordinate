// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { revisionClassNames, ThemeableTokenName, themeableTokens } from '../internal/generated/theming';
import { warnOnce } from '../internal/logging';

export type { ThemeableTokenName };

/**
 * A literal CSS value, or a pair for light and dark mode.
 */
export type ThemeValue = string | { light: string; dark: string };

export interface Theme {
  tokens: Partial<Record<ThemeableTokenName, ThemeValue>>;
}

export interface ApplyThemeParams {
  theme: Theme;
  /**
   * The element whose subtree takes the theme. Defaults to the whole document.
   */
  target?: HTMLElement;
  /**
   * Nonce for the injected `<style>` element, for pages with a content security policy.
   */
  nonce?: string;
}

export interface ApplyThemeResult {
  /**
   * Removes the theme, so every token returns to the pinned revision's value.
   */
  reset: () => void;
}

export interface GenerateThemeStylesheetParams {
  theme: Theme;
  /**
   * The selector that scopes the theme. Defaults to `:root`.
   */
  selector?: string;
}

const themeAttribute = 'data-ord-theme';
const unsafeValue = /[;{}<]/;
let themeCount = 0;

function isThemeable(name: string): name is ThemeableTokenName {
  return Object.prototype.hasOwnProperty.call(themeableTokens, name);
}

function formatValue(name: string, value: ThemeValue): string | null {
  const parts = typeof value === 'string' ? [value] : [value.light, value.dark];
  if (parts.some(part => typeof part !== 'string' || !part.trim() || unsafeValue.test(part))) {
    warnOnce('applyTheme', `The value for "${name}" is not a valid CSS value and was ignored.`);
    return null;
  }
  return typeof value === 'string' ? value : `light-dark(${value.light}, ${value.dark})`;
}

function declarations(theme: Theme): string[] {
  const lines: string[] = [];
  for (const [name, value] of Object.entries(theme.tokens)) {
    if (!isThemeable(name)) {
      warnOnce('applyTheme', `"${name}" is not a themeable token and was ignored.`);
      continue;
    }
    const formatted = value === undefined ? null : formatValue(name, value);
    if (formatted !== null) {
      lines.push(`  ${themeableTokens[name]}: ${formatted};`);
    }
  }
  return lines;
}

/**
 * Builds the stylesheet `applyTheme` would inject, for server-rendered pages that
 * inline it in `<head>`.
 */
export function generateThemeStylesheet({ theme, selector = ':root' }: GenerateThemeStylesheetParams): string {
  const lines = declarations(theme);
  if (!lines.length) {
    return '';
  }
  // Repeating the selector lifts it above the revision classes, so the theme wins on the
  // themed element itself as well as on revision subtrees inside it.
  const scope = `${selector}${selector}`;
  const nested = `${scope} :is(${revisionClassNames.map(name => `.${name}`).join(', ')})`;
  return `${scope},\n${nested} {\n${lines.join('\n')}\n}\n`;
}

/**
 * Overrides brand colors, fonts and corner radii for the whole page or one subtree.
 * The theme sits on top of the pinned revision and wins for the tokens it sets.
 */
export function applyTheme({ theme, target, nonce }: ApplyThemeParams): ApplyThemeResult {
  const id = `${++themeCount}`;
  const selector = target ? `[${themeAttribute}="${id}"]` : ':root';
  const style = document.createElement('style');
  style.setAttribute(themeAttribute, id);
  if (nonce) {
    style.nonce = nonce;
  }
  style.textContent = generateThemeStylesheet({ theme, selector });
  document.head.appendChild(style);
  target?.setAttribute(themeAttribute, id);

  return {
    reset: () => {
      style.remove();
      if (target?.getAttribute(themeAttribute) === id) {
        target.removeAttribute(themeAttribute);
      }
    },
  };
}
