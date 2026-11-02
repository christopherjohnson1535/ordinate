// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../pagination/styles.css.js';

export default class PaginationWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findPreviousPageButton(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(styles['previous-page'])!;
  }

  findNextPageButton(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(styles['next-page'])!;
  }

  /**
   * Returns the page number buttons that are shown, in order. Ellipses are not included.
   */
  findPageNumbers(): ElementWrapper<HTMLButtonElement>[] {
    return this.findAllByClassName<HTMLButtonElement>(styles['page-number']);
  }

  /**
   * Returns the button for a page number, if it is shown. Page numbers are lettered with leading zeros,
   * such as "03", so they are compared as numbers.
   */
  findPageNumberByIndex(pageIndex: number): ElementWrapper<HTMLButtonElement> | null {
    return this.findPageNumbers().find(button => Number(button.getText()) === pageIndex) ?? null;
  }

  /**
   * The current page in small capitals before the page numbers, shown with `showPageLabel`.
   */
  findPageLabel(): ElementWrapper | null {
    return this.findByClassName(styles['page-label']);
  }

  findCurrentPage(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(styles['current-page'])!;
  }

  findEllipses(): ElementWrapper[] {
    return this.findAllByClassName(styles.ellipsis);
  }

  isDisabled(): boolean {
    return this.getElement().classList.contains(styles['root-disabled']);
  }
}
