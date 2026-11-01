// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';
import ModalWrapper from '../modal';

import styles from '../../../split-panel/styles.css.js';

export default class SplitPanelWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  private buttonAt(selector: string): ButtonWrapper | null {
    const element = this.getElement().querySelector<HTMLElement>(selector);
    return element ? new ButtonWrapper(element) : null;
  }

  isOpen(): boolean {
    return this.getElement().classList.contains(styles.open);
  }

  /**
   * The position the panel is shown in.
   */
  getPosition(): 'bottom' | 'side' {
    const classes = this.getElement().classList;
    return classes.contains(styles['position-side']) || classes.contains(styles['side-rail']) ? 'side' : 'bottom';
  }

  findHeader(): ElementWrapper | null {
    return this.findByClassName(styles.heading);
  }

  /**
   * The circled tag before the title.
   */
  findHeaderTag(): ElementWrapper | null {
    return this.findByClassName(styles.tag);
  }

  /**
   * The label above the title that repeats the tag, such as "Detail S3".
   */
  findHeaderKicker(): ElementWrapper | null {
    return this.findByClassName(styles.kicker);
  }

  findHeaderDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  findHeaderInfo(): ElementWrapper | null {
    return this.findByClassName(styles.info);
  }

  findHeaderActions(): ElementWrapper | null {
    return this.findByClassName(styles.actions);
  }

  findContent(): ElementWrapper | null {
    return this.findByClassName(styles.content);
  }

  /**
   * The button that opens the collapsed panel.
   */
  findOpenButton(): ButtonWrapper | null {
    return this.isOpen() ? null : this.buttonAt('button');
  }

  findCloseButton(): ButtonWrapper | null {
    return this.buttonAt(`.${styles['close-button']}`);
  }

  findPreferencesButton(): ButtonWrapper | null {
    return this.buttonAt(`.${styles['preferences-button']}`);
  }

  /**
   * The separator that resizes the panel with a drag or the arrow keys.
   */
  findResizeHandle(): ElementWrapper | null {
    return this.find('[role="separator"]');
  }

  findPreferencesModal(): ModalWrapper | null {
    return this.findComponent(ModalWrapper);
  }
}
