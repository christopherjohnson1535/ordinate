// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../segmented-control/styles.css.js';

export default class SegmentedControlWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns every segment, in order, including disabled ones.
   */
  findSegments(): ElementWrapper<HTMLButtonElement>[] {
    return this.findAllByClassName<HTMLButtonElement>(styles.segment);
  }

  findSegmentById(id: string): ElementWrapper<HTMLButtonElement> | null {
    return this.findSegments().find(segment => segment.getElement().dataset.segmentId === id) ?? null;
  }

  findSelectedSegment(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName<HTMLButtonElement>(styles.selected);
  }
}
