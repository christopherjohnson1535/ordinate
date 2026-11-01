// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import AnnotationContextWrapper from '../annotation-context';
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../hotspot/styles.css.js';

export default class HotspotWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  getHotspotId(): string {
    return this.getElement().dataset.hotspotId ?? '';
  }

  /**
   * The marker button, or `null` while no step of the current task points at the hotspot.
   */
  findMarker(): ElementWrapper<HTMLButtonElement> | null {
    return this.findByClassName<HTMLButtonElement>(styles.marker);
  }

  /**
   * Whether the marker belongs to the current step, which makes it pulse.
   */
  isCurrent(): boolean {
    return this.findByClassName(styles['marker-current']) !== null;
  }

  /**
   * The open annotation of the current step, when it points at this hotspot.
   */
  findAnnotation(): AnnotationContextWrapper | null {
    return this.findComponent(AnnotationContextWrapper);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }
}
