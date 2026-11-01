// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface FileTokenGroupProps extends BaseComponentProps {
  /**
   * The files to show, one token each. Each item has:
   * * `file`: the `File` object.
   * * `loading` (optional): shows a spinner in place of the thumbnail, for a file that is still uploading.
   * * `errorText` (optional): an error shown below the token, which also marks the token as invalid.
   * * `warningText` (optional): a warning shown below the token. It is not shown while `errorText` is set.
   */
  items: ReadonlyArray<FileTokenGroupProps.Item>;
  /**
   * Called when the user removes a file, with its position in `items` in `event.detail.fileIndex`.
   * Remove the file here. Without this handler, tokens have no remove button.
   */
  onDismiss?: NonCancelableEventHandler<FileTokenGroupProps.DismissDetail>;
  /**
   * Shows the size of each file.
   */
  showFileSize?: boolean;
  /**
   * Shows the date and time each file was last changed.
   */
  showFileLastModified?: boolean;
  /**
   * Shows a small preview of each image file, and a file icon for other files.
   */
  showFileThumbnail?: boolean;
  /**
   * Shows only this many files, with a button that shows the rest.
   */
  limit?: number;
  /**
   * - `horizontal` wraps the tokens in rows.
   * - `vertical` stacks the tokens, one per line, across the full width.
   */
  alignment?: FileTokenGroupProps.Alignment;
  /**
   * Shows the files as part of a read-only value: they cannot be removed.
   */
  readOnly?: boolean;
  /**
   * Accessible name of the list of files.
   */
  ariaLabel?: string;
  /**
   * Texts and formats used in the tokens:
   * * `removeFileAriaLabel(fileIndex, fileName)`: accessible name of a file's remove button.
   * * `limitShowMore`: text of the button that shows the files beyond `limit`, such as "Show 3 more".
   * * `limitShowFewer`: text of the button that hides them again.
   * * `errorIconAriaLabel`: what screen readers hear for the error icon.
   * * `warningIconAriaLabel`: what screen readers hear for the warning icon.
   * * `formatFileSize(sizeInBytes)`: formats a file size. Defaults to B, KB, MB or GB, in steps of 1000.
   * * `formatFileLastModified(date)`: formats the last-changed date.
   */
  i18nStrings?: FileTokenGroupProps.I18nStrings;
}

export namespace FileTokenGroupProps {
  export type Alignment = 'horizontal' | 'vertical';

  export interface Item {
    file: File;
    loading?: boolean;
    errorText?: React.ReactNode;
    warningText?: React.ReactNode;
  }

  export interface DismissDetail {
    fileIndex: number;
  }

  export interface I18nStrings {
    removeFileAriaLabel?: (fileIndex: number, fileName: string) => string;
    limitShowMore?: string;
    limitShowFewer?: string;
    errorIconAriaLabel?: string;
    warningIconAriaLabel?: string;
    formatFileSize?: (sizeInBytes: number) => string;
    formatFileLastModified?: (date: Date) => string;
  }
}
