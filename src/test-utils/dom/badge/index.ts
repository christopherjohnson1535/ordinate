// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '../core';

import styles from '../../../badge/styles.css.js';

export default class BadgeWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.badge}`;
}
