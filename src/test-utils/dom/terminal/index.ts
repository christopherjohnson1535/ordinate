// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../terminal/styles.css.js';

export default class TerminalWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns every line, in order.
   */
  findLines(): ElementWrapper[] {
    return this.findAllByClassName(styles.line);
  }

  /**
   * Returns the lines of one type, such as `command`.
   */
  findLinesOfType(type: 'command' | 'output' | 'header' | 'success' | 'error' | 'muted'): ElementWrapper[] {
    return this.findAllByClassName(styles[`type-${type}`]);
  }

  findHighlightedLines(): ElementWrapper[] {
    return this.findAllByClassName(styles.highlighted);
  }
}
