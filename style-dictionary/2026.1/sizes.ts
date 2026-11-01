// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SizesDictionary } from '../utils/interfaces.js';

export const tokens: SizesDictionary = {
  sizeControlHeight: { comfortable: '36px', compact: '30px' },
  sizeControlHeightSmall: { comfortable: '28px', compact: '24px' },
  sizeIcon: '16px',
  sizeIconSmall: '12px',
  sizeIconMedium: '20px',
  sizeIconBig: '32px',
  sizeIconLarge: '48px',
  sizeCheckbox: '18px',
  sizeToggleWidth: '32px',
  sizeToggleHeight: '18px',
  sizeModalSmall: '400px',
  sizeModalMedium: '600px',
  sizeModalLarge: '820px',
  sizeDropdownMaxHeight: '320px',
  sizePanelSmall: '240px',
  sizePanelMedium: '320px',
  sizePanelLarge: '480px',
  sizeDropdownMaxWidth: '360px',
  // The widest a website section's content grows before it centers in the band.
  sizeSectionNarrow: '720px',
  sizeSectionDefault: '1200px',
  sizeSectionWide: '1440px',
  // How far markers such as an opening's badge tilt. The console keeps them level.
  rotateMarker: '0deg',
  // The longest comfortable line for running text beside or under other content: a menu item's
  // note, a card's summary or a quote, and a caption or section description.
  sizeMeasureNarrow: '48ch',
  sizeMeasureDefault: '64ch',
  sizeMeasureWide: '72ch',
};
