// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Style } from '../utils/style.js';

export const style: Style = {
  id: 'editorial',
  description: 'Journals, blogs and newsletters: serif headlines, a large type scale and printed-page rules.',
  overrides: {
    fontFamilyDisplay: '{fontFamilySerif}',
    fontFamilyHeadline: '{fontFamilySerif}',
    fontWeightPageHeading: '{fontWeightHeadline}',
    fontWeightHeadline: '{fontWeightBody}',
    fontSizeHeadlineS: '28px',
    fontSizeHeadlineM: '44px',
    fontSizeHeadlineL: 'clamp(44px, 6vw, 84px)',
    fontSizeHeadlineXl: 'clamp(64px, 12vw, 168px)',
    lineHeightHeadline: '0.98',
    letterSpacingHeadline: '-0.025em',
    fontSizeLead: '22px',
    fontFamilyReading: '{fontFamilySerif}',
    fontSizeReading: '19px',
    lineHeightReading: '1.55',
    borderWidthHeadRule: '{borderWidthDefault}',
  },
};
