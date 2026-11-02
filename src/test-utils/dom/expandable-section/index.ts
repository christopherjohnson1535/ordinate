// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../expandable-section/styles.css.js';

export default class ExpandableSectionWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  isExpanded(): boolean {
    return this.findExpandButton().getElement().getAttribute('aria-expanded') === 'true';
  }

  /**
   * The header area: the button, info and actions, and the description.
   */
  findHeader(): ElementWrapper {
    return this.findByClassName(styles.header)!;
  }

  /**
   * The button that opens and closes the section.
   */
  findExpandButton(): ElementWrapper<HTMLButtonElement> {
    return this.findByClassName<HTMLButtonElement>(styles.trigger)!;
  }

  findHeaderText(): ElementWrapper {
    return this.findByClassName(styles['header-text'])!;
  }

  findHeaderDescription(): ElementWrapper | null {
    return this.findByClassName(styles.description);
  }

  /**
   * The dimension line on the construction line that opens the section, which holds `headerCounter`.
   */
  findHeaderCounter(): ElementWrapper | null {
    return this.findByClassName(styles.counter);
  }

  findHeaderActions(): ElementWrapper | null {
    return this.findByClassName(styles.actions);
  }

  /**
   * The content region. It stays in the page while the section is closed, hidden with the `hidden` attribute.
   */
  findContent(): ElementWrapper {
    return this.findByClassName(styles.content)!;
  }
}
