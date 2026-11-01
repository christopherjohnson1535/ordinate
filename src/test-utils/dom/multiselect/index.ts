// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ElementWrapper } from '../core';
import { SelectBaseWrapper } from '../internal/option-list';
import { findTokens, findTokenToggle, TokenWrapper } from '../internal/token-list';

import optionListStyles from '../../../internal/components/option-list/styles.css.js';
import styles from '../../../multiselect/styles.css.js';

export default class MultiselectWrapper extends SelectBaseWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the selected options in the open list, without the "Select all" row.
   */
  findSelectedOptions(): ElementWrapper[] {
    return this.findOptions().filter(
      option =>
        option.getElement().getAttribute('aria-selected') === 'true' &&
        !option.getElement().classList.contains(optionListStyles['option-extra'])
    );
  }

  /**
   * Returns the "Select all" row while the list is open and `enableSelectAll` is set.
   */
  findSelectAll(): ElementWrapper | null {
    return this.findByClassName(optionListStyles['option-extra']);
  }

  /**
   * Returns the tokens of the selected options shown below the trigger.
   */
  findTokens(): TokenWrapper[] {
    return findTokens(this);
  }

  /**
   * Returns the button that shows or hides the tokens beyond `tokenLimit`.
   */
  findTokenToggle(): ButtonWrapper | null {
    return findTokenToggle(this);
  }
}
