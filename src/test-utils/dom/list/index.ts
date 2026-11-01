// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../list/styles.css.js';

/**
 * One row of a list.
 */
export class ListItemWrapper extends ElementWrapper {
  findContent(): ElementWrapper {
    return this.findByClassName(styles.content)!;
  }

  findSecondaryContent(): ElementWrapper | null {
    return this.findByClassName(styles['secondary-content']);
  }

  findIconSlot(): ElementWrapper | null {
    return this.findByClassName(styles.icon);
  }

  findActions(): ElementWrapper | null {
    return this.findByClassName(styles.actions);
  }

  findMoveUpButton(): ButtonWrapper | null {
    return this.findSortButton(0);
  }

  findMoveDownButton(): ButtonWrapper | null {
    return this.findSortButton(1);
  }

  private findSortButton(position: number): ButtonWrapper | null {
    const element = this.findByClassName(styles['sort-controls'])?.findAll('button')[position];
    return element ? new ButtonWrapper(element.getElement()) : null;
  }
}

export default class ListWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findItems(): ListItemWrapper[] {
    return this.findAllByClassName(styles.item).map(item => new ListItemWrapper(item.getElement()));
  }
}
