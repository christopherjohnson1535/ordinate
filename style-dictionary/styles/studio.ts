// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Style } from '../utils/style.js';

export const style: Style = {
  id: 'studio',
  description: 'Portfolios and practices: light, very large headlines, image-led layouts and catalogue captions.',
  overrides: {
    fontWeightHeadline: '{fontWeightLight}',
    fontSizeHeadlineS: '26px',
    fontSizeHeadlineM: '40px',
    fontSizeHeadlineL: 'clamp(36px, 4.6vw, 64px)',
    fontSizeHeadlineXl: 'clamp(48px, 7.2vw, 108px)',
    lineHeightHeadline: '0.98',
    letterSpacingHeadline: '-0.035em',
    fontSizeLead: '19px',
    fontSizeReading: '17px',
    lineHeightReading: '1.65',
    borderWidthHeadRule: '{borderWidthDefault}',
  },
};
