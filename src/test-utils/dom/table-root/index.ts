// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '../core';
import { TableGridWrapper } from '../internal/table-grid';

import styles from '../../../table-root/styles.css.js';

export default class TableRootWrapper extends TableGridWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The native `<table>` element.
   */
  findTableElement(): ElementWrapper<HTMLTableElement> {
    return this.find<HTMLTableElement>(`:scope > .${styles.table}`)!;
  }

  protected findGrid(): ElementWrapper<HTMLTableElement> | null {
    return this.findTableElement();
  }
}
