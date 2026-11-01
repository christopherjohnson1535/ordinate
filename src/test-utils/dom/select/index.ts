// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '../core';
import { SelectBaseWrapper } from '../internal/option-list';

import optionListStyles from '../../../internal/components/option-list/styles.css.js';
import selectStyles from '../../../select/styles.css.js';

export default class SelectWrapper extends SelectBaseWrapper {
  static rootSelector = `.${selectStyles.root}`;

  findSelectedOption(): ElementWrapper | null {
    return this.findByClassName(optionListStyles['option-selected']);
  }
}
