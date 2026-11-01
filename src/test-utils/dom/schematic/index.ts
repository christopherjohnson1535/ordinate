// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../schematic/styles.css.js';

export class SchematicPartWrapper extends ElementWrapper {
  isShown(): boolean {
    return this.getElement().classList.contains(styles.shown);
  }

  isAccent(): boolean {
    return this.getElement().classList.contains(styles.accent);
  }

  isDimmed(): boolean {
    return this.getElement().classList.contains(styles.dimmed);
  }

  isPending(): boolean {
    return this.getElement().classList.contains(styles.pending);
  }

  isRemoved(): boolean {
    return this.getElement().classList.contains(styles.removed);
  }

  findLabel(): ElementWrapper | null {
    return this.findByClassName(styles.label);
  }

  findDetail(): ElementWrapper | null {
    return this.findByClassName(styles.detail);
  }
}

export default class SchematicWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the `<svg>` that holds the drawing.
   */
  findDrawing(): ElementWrapper | null {
    return this.findByClassName(styles.drawing);
  }

  /**
   * Returns a part by its ID, shown or hidden.
   */
  findPart(id: string): SchematicPartWrapper | null {
    const element = this.find(`.${styles.part}[data-part-id="${id.replace(/"/g, '\\"')}"]`);
    return element ? new SchematicPartWrapper(element.getElement()) : null;
  }

  /**
   * Returns a wire by its ID, shown or hidden.
   */
  findWire(id: string): SchematicPartWrapper | null {
    const element = this.find(`.${styles.wire}[data-wire-id="${id.replace(/"/g, '\\"')}"]`);
    return element ? new SchematicPartWrapper(element.getElement()) : null;
  }

  /**
   * Returns the parts the current scene shows.
   */
  findShownParts(): SchematicPartWrapper[] {
    return this.findAll(`.${styles.part}.${styles.shown}`).map(w => new SchematicPartWrapper(w.getElement()));
  }
}
