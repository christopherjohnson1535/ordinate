// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../navigable-group/styles.css.js';

export default class NavigableGroupWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The item that holds the tab stop: the one Tab moves focus to.
   */
  findTabStop(): ElementWrapper | null {
    const root = this.getElement();
    return (
      this.findAll('[data-navigable-group-item][tabindex="0"]').find(
        item => item.getElement().closest('[data-navigable-group]') === root
      ) ?? null
    );
  }
}
