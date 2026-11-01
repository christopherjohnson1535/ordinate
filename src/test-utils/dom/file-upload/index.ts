// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import ButtonWrapper from '../button';
import { ComponentWrapper, ElementWrapper } from '../core';
import FileDropzoneWrapper from '../file-dropzone';
import FileInputWrapper from '../file-input';
import FileTokenGroupWrapper, { FileTokenWrapper } from '../file-token-group';
import { dragFilesOver } from '../internal/file-transfer';

import styles from '../../../file-upload/styles.css.js';

// The button, the drop zone and the token group are found with the generated `findFileInput`,
// `findFileDropzone` and `findFileTokenGroup`. The drop zone is only there while files are dragged
// over the page, and replaces the button meanwhile.
export default class FileUploadWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  /**
   * Returns the file tokens shown, without the ones hidden beyond `tokenLimit`.
   */
  findFileTokens(): FileTokenWrapper[] {
    return this.findComponent(FileTokenGroupWrapper)?.findFileTokens() ?? [];
  }

  /**
   * Returns the token of the file at this position, counting from 1.
   */
  findFileToken(position: number): FileTokenWrapper | null {
    return this.findFileTokens()[position - 1] ?? null;
  }

  /**
   * Returns the button that shows or hides the files beyond `tokenLimit`.
   */
  findTokenToggle(): ButtonWrapper | null {
    return this.findComponent(FileTokenGroupWrapper)?.findTokenToggle() ?? null;
  }

  findConstraint(): ElementWrapper | null {
    return this.findByClassName(styles.constraint);
  }

  findError(): ElementWrapper | null {
    return this.findByClassName(styles.error);
  }

  findWarning(): ElementWrapper | null {
    return this.findByClassName(styles.warning);
  }

  /**
   * Chooses files as if the user had picked them in the file chooser, firing `onChange`.
   */
  selectFiles(files: ReadonlyArray<File>): void {
    this.findComponent(FileInputWrapper)!.selectFiles(files);
  }

  /**
   * Drags files over the page, which swaps the button for the drop zone, and drops them on the zone,
   * firing `onChange`.
   */
  dropFiles(files: ReadonlyArray<File>): void {
    dragFilesOver(this, files);
    this.findComponent(FileDropzoneWrapper)!.dropFiles(files);
  }
}
