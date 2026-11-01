// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';
import RadioButtonWrapper from '../radio-button';

import styles from '../../../tiles/styles.css.js';

export default class TilesWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findItems(): ElementWrapper[] {
    return this.findAllByClassName(styles.tile);
  }

  /**
   * Returns the tile with the given value.
   */
  findItemByValue(value: string): ElementWrapper | null {
    return this.findItems().find(item => item.find<HTMLInputElement>('input')?.getElement().value === value) ?? null;
  }

  findSelectedItem(): ElementWrapper | null {
    return this.findByClassName(styles.selected);
  }

  findRadioButtons(): RadioButtonWrapper[] {
    return this.findAllComponents(RadioButtonWrapper);
  }

  /**
   * Returns the image of a tile, if it has one.
   */
  findItemImage(item: ElementWrapper): ElementWrapper | null {
    return item.findByClassName(styles.image);
  }

  getSelectedValue(): string | null {
    return this.find<HTMLInputElement>('input[type="radio"]:checked')?.getElement().value ?? null;
  }
}
