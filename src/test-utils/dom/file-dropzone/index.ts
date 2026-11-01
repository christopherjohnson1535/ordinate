// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, ElementWrapper } from '../core';
import { dragFilesOver, dropFiles } from '../internal/file-transfer';

import styles from '../../../file-dropzone/styles.css.js';

export default class FileDropzoneWrapper extends ComponentWrapper {
  static rootSelector = `.${styles.root}`;

  findContent(): ElementWrapper {
    return this.findByClassName(styles.content)!;
  }

  /**
   * Whether files are being dragged over the page, which outlines the zone.
   */
  isPageDragging(): boolean {
    return this.element.classList.contains(styles['page-dragging']);
  }

  /**
   * Whether files are being dragged over the zone itself, which highlights it.
   */
  isActive(): boolean {
    return this.element.classList.contains(styles.active);
  }

  /**
   * Drags files over the zone without dropping them.
   */
  dragFilesOver(files: ReadonlyArray<File>): void {
    dragFilesOver(this, files);
  }

  /**
   * Drags files onto the zone and drops them, firing `onChange`.
   */
  dropFiles(files: ReadonlyArray<File>): void {
    dropFiles(this, files);
  }
}
