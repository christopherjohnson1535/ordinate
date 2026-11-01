// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../content-layout/styles.css.js';

export default class ContentLayoutWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findHeader(): ElementWrapper | null {
    return this.find(`:scope > .${styles['header-area']} > .${styles.header}`);
  }

  findBreadcrumbs(): ElementWrapper | null {
    return this.find(`:scope > .${styles['header-area']} > .${styles.breadcrumbs}`);
  }

  findNotifications(): ElementWrapper | null {
    return this.find(`:scope > .${styles['header-area']} > .${styles.notifications}`);
  }

  findContent(): ElementWrapper {
    return this.find(`:scope > .${styles.content}`)!;
  }
}
