// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  BordersTokenName,
  ColorPaletteTokenName,
  ColorsTokenName,
  MotionTokenName,
  SizesTokenName,
  SpacingTokenName,
  TokenName,
  TypographyTokenName,
} from './token-names.js';

/**
 * A literal CSS value, or a reference to another token written as `{tokenName}`.
 */
export type GlobalValue = string;

/**
 * A value that differs between light and dark mode.
 */
export interface ModeValue {
  light: GlobalValue;
  dark: GlobalValue;
}

/**
 * A value that differs between comfortable and compact density.
 */
export interface DensityValue {
  comfortable: GlobalValue;
  compact: GlobalValue;
}

export type TokenValue = GlobalValue | ModeValue | DensityValue;

export type ColorPaletteDictionary = Record<ColorPaletteTokenName, GlobalValue>;
export type ColorsDictionary = Record<ColorsTokenName, ModeValue>;
export type BordersDictionary = Record<BordersTokenName, GlobalValue>;
export type TypographyDictionary = Record<TypographyTokenName, GlobalValue>;
export type SpacingDictionary = Record<SpacingTokenName, GlobalValue | DensityValue>;
export type SizesDictionary = Record<SizesTokenName, GlobalValue | DensityValue>;
export type MotionDictionary = Record<MotionTokenName, GlobalValue>;

/**
 * The token contract. Every revision provides a value for every token.
 */
export type RevisionTokens = Record<TokenName, TokenValue>;

export interface Revision {
  /** Calendar version, for example `2026.1`. Published revisions never change. */
  id: string;
  tokens: RevisionTokens;
}
