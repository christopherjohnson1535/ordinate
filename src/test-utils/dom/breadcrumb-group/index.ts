// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../breadcrumb-group/styles.css.js';
import dropdownStyles from '../../../internal/components/dropdown/styles.css.js';

export default class BreadcrumbGroupWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  private findVisibleList(): ElementWrapper {
    return this.find(`:scope > .${styles.list}`)!;
  }

  /**
   * Returns the visible items, in order, as links. The current page is not a link and is
   * returned by `findCurrentPage`. Items collapsed behind the ellipsis are not included.
   */
  findBreadcrumbLinks(): ElementWrapper<HTMLAnchorElement>[] {
    return this.findVisibleList().findAll<HTMLAnchorElement>(`:scope > li > .${styles.link}`);
  }

  /**
   * Returns the visible link at a position, counting from 1.
   */
  findBreadcrumbLink(index: number): ElementWrapper<HTMLAnchorElement> | null {
    return this.findBreadcrumbLinks()[index - 1] ?? null;
  }

  findCurrentPage(): ElementWrapper | null {
    return this.findVisibleList().find(`.${styles.current}`);
  }

  /**
   * Returns the button that shows the collapsed items, when items are collapsed.
   */
  findEllipsis(): ElementWrapper<HTMLButtonElement> | null {
    return this.findVisibleList().find<HTMLButtonElement>(`.${styles['expand-button']}`);
  }

  findDropdown(): ElementWrapper | null {
    return this.findVisibleList().find(`.${dropdownStyles.popup}`);
  }

  /**
   * Returns the links of the collapsed items while their menu is open.
   */
  findDropdownLinks(): ElementWrapper<HTMLAnchorElement>[] {
    return this.findAllByClassName<HTMLAnchorElement>(styles['menu-link']);
  }
}
