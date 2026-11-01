// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RevisionTokens } from './interfaces.js';

/**
 * A style changes the voice of a whole page: type, emphasis colors, bands and corners. It sits
 * on top of the pinned revision and overrides only the tokens it lists; every other token keeps
 * the revision's value. References stay live, so a style follows each revision and both modes.
 */
export interface Style {
  /** The name applications pass to `applyStyle`, such as `editorial`. */
  id: string;
  /** What the style is for, in one line. */
  description: string;
  overrides: Partial<RevisionTokens>;
}
