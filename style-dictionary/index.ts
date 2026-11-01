// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { revision as revision2026_1 } from './2026.1/index.js';
import { revision as revision2026_2 } from './2026.2/index.js';
import { style as editorial } from './styles/editorial.js';
import { style as shopfront } from './styles/shopfront.js';
import { style as studio } from './styles/studio.js';
import { Revision } from './utils/interfaces.js';
import { Style } from './utils/style.js';

/**
 * Supported revisions, oldest first. The first entry is the default when an
 * application has not pinned a revision.
 */
export const revisions: ReadonlyArray<Revision> = [revision2026_1, revision2026_2];

/**
 * Site styles, on top of the pinned revision. The console style is the revision itself, so it
 * has no entry here.
 */
export const styles: ReadonlyArray<Style> = [editorial, studio, shopfront];

export { resolveTokens } from './utils/resolve.js';
export { themeableTokenNames } from './utils/themeable.js';
export { allTokenNames } from './utils/token-names.js';
export type { Revision, RevisionTokens } from './utils/interfaces.js';
export type { Style } from './utils/style.js';
