// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { bordersTokenNames, TokenName } from './token-names.js';

/**
 * Tokens an application may change at runtime with `applyTheme`. Status colors,
 * body text colors, spacing, sizes and motion are deliberately left out; see
 * docs/THEMING.md.
 */
export const themeableTokenNames = [
  'colorBackgroundLayoutMain',
  'colorBackgroundContainer',
  'colorBackgroundButtonPrimary',
  'colorBackgroundButtonPrimaryHover',
  'colorTextButtonPrimary',
  'colorTextLink',
  'colorTextLinkHover',
  'colorTextAccent',
  'colorBorderAccent',
  'colorBorderFocusRing',
  'colorBackgroundControlChecked',
  'colorForegroundControlChecked',
  'colorBackgroundItemSelected',
  'colorBackgroundHighlight',
  'fontFamilyBase',
  'fontFamilyDisplay',
  'fontFamilyMono',
  ...bordersTokenNames.filter(name => name.startsWith('borderRadius')),
] satisfies ReadonlyArray<TokenName>;
