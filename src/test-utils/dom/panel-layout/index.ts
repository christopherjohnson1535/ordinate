// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../panel-layout/styles.css.js';

export default class PanelLayoutWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findPanelContent(): ElementWrapper | null {
    return this.find(`:scope > .${styles.panel}`);
  }

  findMainContent(): ElementWrapper | null {
    return this.find(`:scope > .${styles.main}`);
  }

  /**
   * Returns the resize handle, present only when the layout is resizable and shows both panes.
   */
  findResizeHandle(): ElementWrapper | null {
    return this.find(`:scope > .${styles.handle}`);
  }
}
