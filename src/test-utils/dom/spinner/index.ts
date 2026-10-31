// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '../core';

import styles from '../../../spinner/styles.css.js';

export default class SpinnerWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;
}
