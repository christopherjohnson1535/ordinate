// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';
import TokenWrapper from '../token';

import styles from '../../../file-token-group/styles.css.js';
import spinnerStyles from '../../../spinner/styles.css.js';

export class FileTokenWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.item}`;

  findFileName(): ElementWrapper {
    return this.findByClassName(styles['file-name'])!;
  }

  findFileSize(): ElementWrapper | null {
    return this.findByClassName(styles['file-size']);
  }

  findFileLastModified(): ElementWrapper | null {
    return this.findByClassName(styles['file-last-modified']);
  }

  /**
   * The preview of an image file, shown with `showFileThumbnail`.
   */
  findFileThumbnail(): ElementWrapper<HTMLImageElement> | null {
    return this.findByClassName<HTMLImageElement>(styles['thumbnail-image']);
  }

  findFileError(): ElementWrapper | null {
    return this.findByClassName(styles['error-text']);
  }

  findFileWarning(): ElementWrapper | null {
    return this.findByClassName(styles['warning-text']);
  }

  /**
   * The button that removes the file. Read-only groups and groups without `onDismiss` have none.
   */
  findRemoveButton(): ButtonWrapper | null {
    return this.findComponent(TokenWrapper)?.findDismissButton() ?? null;
  }

  isLoading(): boolean {
    return this.findByClassName(spinnerStyles.root) !== null;
  }
}

export default class FileTokenGroupWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the file tokens shown, without the ones hidden beyond `limit`.
   */
  findFileTokens(): FileTokenWrapper[] {
    return this.findAllComponents(FileTokenWrapper);
  }

  /**
   * Returns the token of the file at this position, counting from 1.
   */
  findFileToken(position: number): FileTokenWrapper | null {
    return this.findFileTokens()[position - 1] ?? null;
  }

  /**
   * Returns the button that shows or hides the files beyond `limit`.
   */
  findTokenToggle(): ButtonWrapper | null {
    const element = this.findByClassName(styles.toggle);
    return element ? new ButtonWrapper(element.getElement()) : null;
  }
}
