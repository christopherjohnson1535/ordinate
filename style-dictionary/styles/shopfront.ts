// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Style } from '../utils/style.js';

const cobalt = { light: '{colorCobalt600}', dark: '{colorCobalt300}' };
const onCobalt = { light: '{colorWhite}', dark: '{colorGrey900}' };

export const style: Style = {
  id: 'shopfront',
  description: 'Shops, cafés and local services: condensed headlines, cobalt and sunflower, rounded shapes.',
  overrides: {
    fontFamilyHeadline: '{fontFamilyCondensed}',
    fontWeightHeadline: '{fontWeightHeavy}',
    fontSizeHeadlineS: '24px',
    fontSizeHeadlineM: '40px',
    fontSizeHeadlineL: 'clamp(40px, 5vw, 64px)',
    fontSizeHeadlineXl: 'clamp(56px, 8.4vw, 124px)',
    lineHeightHeadline: '0.92',
    letterSpacingHeadline: '-0.01em',
    colorBackgroundEmphasis: cobalt,
    colorTextOnEmphasis: onCobalt,
    colorBackgroundButtonPrimary: cobalt,
    colorBackgroundButtonPrimaryHover: { light: '{colorCobalt700}', dark: '{colorWhite}' },
    colorTextButtonPrimary: onCobalt,
    colorTextLink: cobalt,
    colorTextAccent: cobalt,
    colorBackgroundControlChecked: cobalt,
    colorForegroundControlChecked: onCobalt,
    colorBackgroundBandAccent: { light: '{colorSunflower100}', dark: '{colorChalk800}' },
    colorBackgroundMarker: { light: '{colorSunflower400}', dark: '{colorSunflower400}' },
    colorTextOnMarker: { light: '{colorGrey900}', dark: '{colorGrey900}' },
    borderRadiusButton: '999px',
    borderRadiusAction: '999px',
    borderRadiusInput: '12px',
    borderRadiusContainer: '24px',
    borderRadiusSection: '32px',
    borderRadiusCheckbox: '6px',
    borderRadiusBadge: '999px',
    borderRadiusToggle: '999px',
    borderRadiusDropdown: '12px',
    // Derived radii are resolved per revision, so they are pointed back at the container here.
    borderRadiusModal: '{borderRadiusContainer}',
    borderRadiusAlert: '{borderRadiusContainer}',
  },
};
