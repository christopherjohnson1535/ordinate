// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';
import { chooseFiles } from '../internal/file-transfer';

import styles from '../../../file-input/styles.css.js';

export default class FileInputWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * The native `<input type="file">`, which holds focus and the accessible name.
   */
  findNativeInput(): ElementWrapper<HTMLInputElement> {
    return this.findByClassName<HTMLInputElement>(styles['native-input'])!;
  }

  /**
   * The button that draws the control and opens the file chooser.
   */
  findTrigger(): ButtonWrapper {
    return new ButtonWrapper(this.findByClassName(styles.trigger)!.getElement());
  }

  /**
   * Chooses files as if the user had picked them in the file chooser, firing `onChange`.
   */
  selectFiles(files: ReadonlyArray<File>): void {
    chooseFiles(this.findNativeInput(), files);
  }
}
