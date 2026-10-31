// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AbstractSwitchWrapper } from '../internal/abstract-switch';

import styles from '../../../radio-button/styles.css.js';

export default class RadioButtonWrapper extends AbstractSwitchWrapper {
  static rootSelector = `.${styles.root}`;
}
