// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '../core';
import { TableGridWrapper } from '../internal/table-grid';

import styles from '../../../table/styles.css.js';
import rootStyles from '../../../table-root/styles.css.js';

export default class TableWrapper extends TableGridWrapper {
  static rootSelector = `.${styles.root}`;

  protected findNativeTable(): ElementWrapper<HTMLTableElement> | null {
    return this.find<HTMLTableElement>(`.${rootStyles.root} > .${rootStyles.table}`);
  }

  findHeaderSlot(): ElementWrapper | null {
    return this.findByClassName(styles['header-slot']);
  }

  findFooterSlot(): ElementWrapper | null {
    return this.findByClassName(styles['footer-slot']);
  }

  /**
   * The element holding the `filter` slot.
   */
  findTextFilter(): ElementWrapper | null {
    return this.findByClassName(styles['tools-filter']);
  }

  /**
   * The element holding the `pagination` slot.
   */
  findPagination(): ElementWrapper | null {
    return this.findByClassName(styles['tools-pagination']);
  }

  /**
   * The element holding the `preferences` slot.
   */
  findCollectionPreferences(): ElementWrapper | null {
    return this.findByClassName(styles['tools-preferences']);
  }

  /**
   * The `empty` content, shown when there are no items and the table is not loading.
   */
  findEmptySlot(): ElementWrapper | null {
    return this.findByClassName(styles.empty);
  }

  /**
   * The loading message, shown while `loading` is set.
   */
  findLoadingText(): ElementWrapper | null {
    return this.findByClassName(styles.loading);
  }
}
