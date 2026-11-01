// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Revision } from '../utils/interfaces.js';
import { tokens as borders } from './borders.js';
import { tokens as colorPalette } from './color-palette.js';
import { tokens as colors } from './colors.js';
import { tokens as effects } from './effects.js';
import { tokens as motion } from './motion.js';
import { tokens as sizes } from './sizes.js';
import { tokens as spacing } from './spacing.js';
import { tokens as typography } from './typography.js';

export const revision: Revision = {
  id: '2026.1',
  tokens: { ...colorPalette, ...colors, ...borders, ...typography, ...spacing, ...sizes, ...motion, ...effects },
};
