// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '../core';

import styles from '../../../box/styles.css.js';

export default class BoxWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;
}
