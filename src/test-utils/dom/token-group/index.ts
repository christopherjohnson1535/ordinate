// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper } from '../core';
import { findTokens, findTokenToggle, TokenWrapper } from '../internal/token-list';

import styles from '../../../token-group/styles.css.js';

export default class TokenGroupWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the tokens shown, without the ones hidden beyond `limit`.
   */
  findTokens(): TokenWrapper[] {
    return findTokens(this);
  }

  /**
   * Returns the button that shows or hides the tokens beyond `limit`.
   */
  findTokenToggle(): ButtonWrapper | null {
    return findTokenToggle(this);
  }
}
