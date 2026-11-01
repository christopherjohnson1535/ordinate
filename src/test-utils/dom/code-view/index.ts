// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../code-view/styles.css.js';

export default class CodeViewWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns every line, in order.
   */
  findLines(): ElementWrapper[] {
    return this.findAllByClassName(styles.line);
  }

  /**
   * Returns the line with the given number, starting from 1.
   */
  findLine(lineNumber: number): ElementWrapper | null {
    return this.find(`.${styles.line}[data-line="${lineNumber}"]`);
  }

  /**
   * Returns the code of a line, without its number or notes.
   */
  findLineContent(lineNumber: number): ElementWrapper | null {
    return this.find(`.${styles.line}[data-line="${lineNumber}"] > .${styles['line-content']}`);
  }

  findHighlightedLines(): ElementWrapper[] {
    return this.findAllByClassName(styles['line-highlighted']);
  }

  findLineNotes(): ElementWrapper[] {
    return this.findAllByClassName(styles['line-note']);
  }

  findLineNumbers(): ElementWrapper[] {
    return this.findAllByClassName(styles['line-number']);
  }
}
