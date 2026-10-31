// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';

import styles from '../../../container/styles.css.js';

export default class ContainerWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findHeader(): ElementWrapper | null {
    return this.find(`:scope > .${styles.header}`);
  }

  findContent(): ElementWrapper {
    return this.find(`:scope > .${styles.content}`)!;
  }

  findFooter(): ElementWrapper | null {
    return this.find(`:scope > .${styles.footer}`);
  }
}
