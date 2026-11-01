// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SpacingDictionary } from '../utils/interfaces.js';

export const tokens: SpacingDictionary = {
  spaceXxxs: '2px',
  spaceXxs: '4px',
  spaceXs: '8px',
  spaceS: '12px',
  spaceM: '16px',
  spaceL: '24px',
  spaceXl: '32px',
  spaceXxl: '48px',
  spaceButtonHorizontal: '14px',
  spaceInputHorizontal: '{spaceS}',
  spaceContainer: { comfortable: '20px', compact: '14px' },
  spaceXxxl: '64px',
  spaceScaledXxs: { comfortable: '4px', compact: '2px' },
  spaceScaledXs: { comfortable: '8px', compact: '6px' },
  spaceScaledS: { comfortable: '12px', compact: '8px' },
  spaceScaledM: { comfortable: '16px', compact: '12px' },
  spaceScaledL: { comfortable: '24px', compact: '16px' },
  spaceScaledXl: { comfortable: '32px', compact: '24px' },
  spaceSectionBlock: { comfortable: '80px', compact: '56px' },
  spaceSectionInline: 'clamp(16px, 4vw, 56px)',
  spaceSectionBlockSmall: { comfortable: '40px', compact: '28px' },
  spaceSectionBlockLarge: { comfortable: '128px', compact: '88px' },
};
