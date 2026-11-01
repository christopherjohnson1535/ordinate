// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../copy-to-clipboard/styles.css.js';
import feedbackStyles from '../../../internal/components/feedback-panel/styles.css.js';

export default class CopyToClipboardWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findCopyButton(): ButtonWrapper {
    return new ButtonWrapper(this.findByClassName(styles.button)!.getElement());
  }

  /**
   * The text shown by the `inline` variant.
   */
  findDisplayedText(): ElementWrapper | null {
    return this.findByClassName(styles.text);
  }

  /**
   * The message shown after a copy, while it is visible. Without `popoverRenderWithPortal`
   * it is inside the component; with it, pass `true` to look in the whole document.
   */
  findStatusText(inPortal = false): ElementWrapper | null {
    const container = inPortal ? this.getElement().ownerDocument.body : this.getElement();
    const element = container.querySelector<HTMLElement>(`.${feedbackStyles.panel}`);
    return element ? new ElementWrapper(element) : null;
  }
}
