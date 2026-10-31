// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { revision as revision2026_1 } from './2026.1/index.js';
import { revision as revision2026_2 } from './2026.2/index.js';
import { Revision } from './utils/interfaces.js';

/**
 * Supported revisions, oldest first. The first entry is the default when an
 * application has not pinned a revision.
 */
export const revisions: ReadonlyArray<Revision> = [revision2026_1, revision2026_2];

export { resolveTokens } from './utils/resolve.js';
export { allTokenNames } from './utils/token-names.js';
export type { Revision, RevisionTokens } from './utils/interfaces.js';
