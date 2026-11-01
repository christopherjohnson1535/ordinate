// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '../core';

import styles from '../../../text-content/styles.css.js';

export default class TextContentWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;
}
