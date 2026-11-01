// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Violations the accessibility pass reports today and that need more than a small fix, by route
 * and axe rule. The pass skips them and fails once one goes away, so the list only shrinks.
 */
export const knownAxeViolations: Record<string, Record<string, string>> = {
  'action-card/permutations': {
    'label-content-name-mismatch':
      'The card is named by its header alone, so the description and content it shows are not part of its name.',
  },
  'app-layout/mobile': {
    'scrollable-region-focusable':
      'With disableBodyScroll the main area scrolls on its own but cannot take focus when nothing in it can.',
  },
  'app-layout/toolbar': {
    'scrollable-region-focusable':
      'With disableBodyScroll the main area scrolls on its own but cannot take focus when nothing in it can.',
  },
  'container/permutations': {
    'scrollable-region-focusable':
      'Content of a fitHeight container scrolls inside it but cannot take focus when nothing in it can.',
  },
  'radio-group/permutations': {
    'color-contrast':
      'The description of a disabled item uses the disabled text color. WCAG exempts inactive controls, ' +
      'but axe only recognizes the label as part of the disabled input.',
  },
};
