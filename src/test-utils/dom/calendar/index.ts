// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../calendar/styles.css.js';
import gridStyles from '../../../internal/components/calendar-grid/styles.css.js';

/**
 * Finders for the parts of a month or year grid, shared by the calendar and the date range picker.
 */
export class CalendarGridWrapper extends ComponentWrapper {
  /**
   * Returns the title of each grid on show, such as "March 2026".
   */
  findTitles(): ElementWrapper[] {
    return this.findAllByClassName(gridStyles.title);
  }

  findPreviousButton(): ButtonWrapper | null {
    return this.findPageButton(0);
  }

  findNextButton(): ButtonWrapper | null {
    const buttons = this.findAllByClassName(gridStyles['page-button']);
    return buttons.length > 0 ? new ButtonWrapper(buttons[buttons.length - 1].getElement()) : null;
  }

  /**
   * Returns the cell for a day as `YYYY-MM-DD`, or for a month as `YYYY-MM-01`.
   */
  findDate(isoDate: string): ElementWrapper | null {
    return this.find(`[data-date="${isoDate}"]`);
  }

  /**
   * Returns every day or month cell on show, in order.
   */
  findDates(): ElementWrapper[] {
    return this.findAll('[data-date]');
  }

  findSelectedDates(): ElementWrapper[] {
    return this.findAllByClassName(gridStyles.selected);
  }

  /**
   * Returns today's cell, or the current month's, when it is on show.
   */
  findCurrentDate(): ElementWrapper | null {
    return this.find('[data-date][aria-current="date"]');
  }

  /**
   * Returns the cell that holds the tab stop.
   */
  findFocusableDate(): ElementWrapper | null {
    return this.find('[data-date][tabindex="0"]');
  }

  private findPageButton(index: number): ButtonWrapper | null {
    const button = this.findAllByClassName(gridStyles['page-button'])[index];
    return button ? new ButtonWrapper(button.getElement()) : null;
  }
}

export default class CalendarWrapper extends CalendarGridWrapper {
  static rootSelector = `.${styles.root}`;

  findTitle(): ElementWrapper {
    return this.findTitles()[0];
  }

  /**
   * The line under the grid that explains why the focused or hovered date is disabled.
   */
  findDisabledReason(): ElementWrapper | null {
    return this.findByClassName(styles['disabled-reason']);
  }
}
