// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../route-map/styles.css.js';

export default class RouteMapWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the rows of the map, one per line, in order. A line with an `href` is an `<a>`.
   */
  findLines(): ElementWrapper[] {
    return this.findAllByClassName(styles.row);
  }

  findLine(id: string): ElementWrapper | null {
    return this.find(`.${styles.row}[data-line-id="${id.replace(/"/g, '\\"')}"]`);
  }

  findStop(id: string): ElementWrapper | null {
    return this.find(`.${styles.stop}[data-stop-id="${id.replace(/"/g, '\\"')}"]`);
  }

  findTerminus(): ElementWrapper | null {
    return this.findByClassName(styles.terminus);
  }

  /**
   * Returns the ring and note around the current stop.
   */
  findCurrentStop(): ElementWrapper | null {
    return this.findByClassName(styles.current);
  }

  findSelectedBand(): ElementWrapper | null {
    return this.findByClassName(styles['band-selected']);
  }
}
