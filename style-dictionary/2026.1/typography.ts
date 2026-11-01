// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { TypographyDictionary } from '../utils/interfaces.js';

export const tokens: TypographyDictionary = {
  fontFamilyBase: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
  fontFamilyMono: "'IBM Plex Mono', ui-monospace, monospace",
  fontFamilyDisplay: '{fontFamilyBase}',
  fontSizeBody: '14px',
  fontSizeLabel: '14px',
  fontSizeDescription: '13px',
  fontSizeSmall: '12px',
  fontSizeCode: '12.5px',
  fontSizeHeadingS: '16px',
  fontSizeHeadingM: '20px',
  fontSizeHeadingL: '24px',
  fontSizeHeadingXl: '28px',
  fontWeightBody: '400',
  fontWeightLabel: '500',
  fontWeightHeading: '600',
  fontStretchLabel: '100%',
  lineHeightBody: '1.5',
  lineHeightHeading: '1.3',
  fontSizeHeadingXs: '{fontSizeBody}',
  fontSizeDisplayXl: '42px',
  fontWeightLight: '300',
  fontWeightBold: '600',
  fontWeightHeavy: '700',
  fontSizeDisplayL: '32px',
  fontFamilySerif: "'IBM Plex Serif', Georgia, serif",
  fontFamilyCondensed: "'IBM Plex Sans Condensed', 'Arial Narrow', sans-serif",
  // Headlines on website layouts: openings, section titles, story and plate titles.
  fontFamilyHeadline: '{fontFamilyDisplay}',
  fontWeightHeadline: '{fontWeightHeading}',
  fontSizeHeadlineS: '24px',
  fontSizeHeadlineM: '36px',
  fontSizeHeadlineL: '56px',
  fontSizeHeadlineXl: 'clamp(48px, 7vw, 96px)',
  lineHeightHeadline: '1.05',
  letterSpacingHeadline: '-0.02em',
  fontSizeLead: '20px',
  // Long-form reading text, such as the body of an article.
  fontFamilyReading: '{fontFamilyBase}',
  fontSizeReading: '16px',
  lineHeightReading: '1.6',
  // Mono uppercase captions: column labels, grid references, title block labels and sheet codes.
  fontSizeCaption: '11px',
  letterSpacingCaption: '0.08em',
  // Page titles drawn like a sheet heading: light and large. Site styles keep their headline weight.
  fontWeightPageHeading: '{fontWeightLight}',
};
