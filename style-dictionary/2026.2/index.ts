// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { revision as parent } from '../2026.1/index.js';
import { Revision } from '../utils/interfaces.js';
import { tokens as borders } from './borders.js';

export const revision: Revision = {
  id: '2026.2',
  tokens: { ...parent.tokens, ...borders },
};
