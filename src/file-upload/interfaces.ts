// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface FileUploadProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The chosen files. The control is controlled: update this in `onChange`.
   */
  value: ReadonlyArray<File>;
  /**
   * Called when the user chooses, drops or removes files, with the new list in `event.detail.value`.
   * With `multiple`, new files are added after the ones in `value`; otherwise a new file replaces it.
   */
  onChange?: NonCancelableEventHandler<FileUploadProps.ChangeDetail>;
  /**
   * Lets the user choose more than one file.
   */
  multiple?: boolean;
  /**
   * The file types the file chooser offers, as for the native `accept` attribute, such as `.pdf,.png`
   * or `image/*`. It is a hint to the browser and does not apply to dropped files, so check each file
   * and report problems with `fileErrors`.
   */
  accept?: string;
  /**
   * Shows the size of each chosen file.
   */
  showFileSize?: boolean;
  /**
   * Shows the date and time each chosen file was last changed.
   */
  showFileLastModified?: boolean;
  /**
   * Shows a small preview of each chosen image, and a file icon for other files.
   */
  showFileThumbnail?: boolean;
  /**
   * Shows only this many files, with a button that shows the rest.
   */
  tokenLimit?: number;
  /**
   * Errors for single files, in the same order as `value`. Leave an entry empty for a file without an error.
   */
  fileErrors?: ReadonlyArray<React.ReactNode>;
  /**
   * Warnings for single files, in the same order as `value`. A file's warning is not shown while it has an error.
   */
  fileWarnings?: ReadonlyArray<React.ReactNode>;
  /**
   * Text below the button describing the rules for the files, such as allowed types and the largest size.
   */
  constraintText?: React.ReactNode;
  /**
   * An error about the files as a whole, shown below the button. Setting it marks the control as invalid.
   * Prefer `errorText` on a surrounding `FormField`.
   */
  errorText?: React.ReactNode;
  /**
   * A warning about the files as a whole, shown below the button. It is not shown while `errorText` is set.
   */
  warningText?: React.ReactNode;
  /**
   * Accessible name of the control, used instead of the button text.
   */
  ariaLabel?: string;
  /**
   * Marks the control as required for assistive technology.
   */
  ariaRequired?: boolean;
  /**
   * Texts and formats used in the control:
   * * `uploadButtonText`: text of the button. Defaults to "Choose file", or "Choose files" with `multiple`.
   * * `dropzoneText`: text shown while files are dragged over the page.
   * * `removeFileAriaLabel(fileIndex, fileName)`: accessible name of a file's remove button.
   * * `limitShowMore`: text of the button that shows the files beyond `tokenLimit`, such as "+3 more".
   * * `limitShowFewer`: text of the button that hides them again.
   * * `errorIconAriaLabel`: what screen readers hear for the error icons.
   * * `warningIconAriaLabel`: what screen readers hear for the warning icons.
   * * `formatFileSize(sizeInBytes)`: formats a file size. Defaults to B, KB, MB or GB, in steps of 1000.
   * * `formatFileLastModified(date)`: formats the last-changed date.
   */
  i18nStrings?: FileUploadProps.I18nStrings;
}

export namespace FileUploadProps {
  export interface ChangeDetail {
    value: File[];
  }

  export interface I18nStrings {
    uploadButtonText?: string;
    dropzoneText?: string;
    removeFileAriaLabel?: (fileIndex: number, fileName: string) => string;
    limitShowMore?: string;
    limitShowFewer?: string;
    errorIconAriaLabel?: string;
    warningIconAriaLabel?: string;
    formatFileSize?: (sizeInBytes: number) => string;
    formatFileLastModified?: (date: Date) => string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the control.
     */
    focus(): void;
  }
}
