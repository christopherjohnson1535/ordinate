// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../slider/styles.css.js';

export default class SliderWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findByClassName<HTMLInputElement>(styles.input)!;
  }

  /**
   * Returns the tick marks on the scale, including the major ones at the minimum, the maximum and the
   * reference values.
   */
  findTickMarks(): ElementWrapper[] {
    return this.findAllByClassName(styles.tick);
  }

  /**
   * Returns the major tick marks: the ones at the minimum, the maximum and the reference values.
   */
  findMajorTickMarks(): ElementWrapper[] {
    return this.findAllByClassName(styles['tick-major']);
  }

  /**
   * Returns the value lettered above the index line.
   */
  findValueTag(): ElementWrapper {
    return this.findByClassName(styles['readout-text'])!;
  }

  /**
   * Returns the value labels below the track: the minimum, the reference values and the maximum, in order.
   */
  findLabels(): ElementWrapper[] {
    return [
      this.findByClassName(styles['label-min'])!,
      ...this.findAllByClassName(styles['label-reference']),
      this.findByClassName(styles['label-max'])!,
    ];
  }

  getValue(): number {
    return Number(this.findNativeInput().getElement().value);
  }

  /**
   * Moves the slider to a value, firing `onChange` as dragging would.
   */
  setValue(value: number): void {
    this.findNativeInput().setNativeValue(String(value));
  }

  isDisabled(): boolean {
    return this.findNativeInput().getElement().disabled;
  }
}
