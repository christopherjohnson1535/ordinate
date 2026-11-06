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
  'examples/all-components': {
    'label-content-name-mismatch':
      'The tree view names each item by its own row text, as on tree-view/simple, so the secondary text and the ' +
      'children of an expanded item are visible but not part of its name.',
  },
  'tree-view/simple': {
    'label-content-name-mismatch':
      'An expanded parent item contains its child items, so its visible text includes theirs, while its name is ' +
      'its own row. This follows the WAI-ARIA tree pattern; naming a parent by all of its children would be worse.',
  },
  'radio-group/permutations': {
    'color-contrast':
      'The description of a disabled item uses the disabled text color. WCAG exempts inactive controls, ' +
      'but axe only recognizes the label as part of the disabled input.',
  },
};
