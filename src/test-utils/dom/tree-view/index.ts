// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../tree-view/styles.css.js';

export class TreeViewItemWrapper extends ElementWrapper<HTMLLIElement> {
  /**
   * The ID that `getItemId` returned for the item.
   */
  getId(): string {
    return this.getElement().dataset.itemId ?? '';
  }

  /**
   * Whether the item is the one set by `currentItemId`.
   */
  isCurrent(): boolean {
    return this.getElement().getAttribute('aria-current') === 'true';
  }

  isExpanded(): boolean {
    return this.getElement().getAttribute('aria-expanded') === 'true';
  }

  /**
   * The expand and collapse button, or `null` for an item without children.
   */
  findToggle(): ElementWrapper<HTMLButtonElement> | null {
    return this.find<HTMLButtonElement>(`:scope > .${styles.row} .${styles.toggle}`);
  }

  findContent(): ElementWrapper {
    return this.find(`:scope > .${styles.row} .${styles.content}`)!;
  }

  findSecondaryContent(): ElementWrapper | null {
    return this.find(`:scope > .${styles.row} .${styles['secondary-content']}`);
  }

  findActions(): ElementWrapper | null {
    return this.find(`:scope > .${styles.row} > .${styles.actions}`);
  }

  /**
   * The item's rendered children: none while it is collapsed.
   */
  findChildItems(): TreeViewItemWrapper[] {
    return this.findAll<HTMLLIElement>(`:scope > .${styles.group} > .${styles.item}`).map(
      item => new TreeViewItemWrapper(item.getElement())
    );
  }
}

export default class TreeViewWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The top-level items.
   */
  findItems(): TreeViewItemWrapper[] {
    return this.findAll<HTMLLIElement>(`.${styles.tree} > .${styles.item}`).map(
      item => new TreeViewItemWrapper(item.getElement())
    );
  }

  /**
   * Every rendered item at any level, in reading order.
   */
  findVisibleItems(): TreeViewItemWrapper[] {
    return this.findAllByClassName<HTMLLIElement>(styles.item).map(item => new TreeViewItemWrapper(item.getElement()));
  }

  findItemById(id: string): TreeViewItemWrapper | null {
    return this.findVisibleItems().find(item => item.getId() === id) ?? null;
  }

  /**
   * The item set by `currentItemId`, while it is rendered.
   */
  findCurrentItem(): TreeViewItemWrapper | null {
    return this.findVisibleItems().find(item => item.isCurrent()) ?? null;
  }
}
