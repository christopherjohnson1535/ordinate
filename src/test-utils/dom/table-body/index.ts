// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '../core';
import TableRowWrapper from '../table-row';

import styles from '../../../table-body/styles.css.js';

export default class TableBodyWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findRows(): TableRowWrapper[] {
    return this.findAll(':scope > tr').map(row => new TableRowWrapper(row.getElement()));
  }
}
