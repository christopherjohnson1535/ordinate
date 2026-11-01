// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';
import TooltipWrapper from '../tooltip';

import styles from '../../../truncated-text/styles.css.js';

export default class TruncatedTextWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the element that holds the text and is cut when it does not fit.
   */
  findText(): ElementWrapper {
    return this.findByClassName(styles.text)!;
  }

  /**
   * Whether the text is cut, which is when hovering or focusing it shows the full text in a tooltip.
   */
  isTruncated(): boolean {
    return this.findText().getElement().dataset.truncated === 'true';
  }

  findTooltip(): TooltipWrapper | null {
    return this.findComponent(TooltipWrapper);
  }
}
