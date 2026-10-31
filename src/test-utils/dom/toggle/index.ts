// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AbstractSwitchWrapper } from '../internal/abstract-switch';

import styles from '../../../toggle/styles.css.js';

export default class ToggleWrapper extends AbstractSwitchWrapper {
  static rootSelector = `.${styles.root}`;
}
