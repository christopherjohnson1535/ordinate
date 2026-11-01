// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../opening-hours/styles.css.js';

export default class OpeningHoursWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findCaption(): ElementWrapper | null {
    return this.findByClassName(styles.caption);
  }

  /**
   * The rows of the table, one per day or per free-form row, in order.
   */
  findRows(): ElementWrapper<HTMLTableRowElement>[] {
    return this.findAllByClassName<HTMLTableRowElement>(styles.row);
  }

  /**
   * The row marked as today, once `highlightToday` has found it.
   */
  findTodayRow(): ElementWrapper<HTMLTableRowElement> | null {
    return this.findByClassName<HTMLTableRowElement>(styles.today);
  }

  /**
   * The rows of closed days.
   */
  findClosedRows(): ElementWrapper<HTMLTableRowElement>[] {
    return this.findAllByClassName<HTMLTableRowElement>(styles.closed);
  }

  /**
   * The day's name in a row, without the today mark.
   */
  findRowLabel(row: ElementWrapper): ElementWrapper {
    return row.findByClassName(styles['day-label'])!;
  }

  /**
   * The hours, or the closed text, in a row, without its note.
   */
  findRowValue(row: ElementWrapper): ElementWrapper {
    return row.findByClassName(styles.value)!;
  }

  findRowNote(row: ElementWrapper): ElementWrapper | null {
    return row.findByClassName(styles.note);
  }

  findTodayMarker(): ElementWrapper | null {
    return this.findByClassName(styles['today-marker']);
  }
}
