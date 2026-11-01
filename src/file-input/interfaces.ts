// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface FileInputProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The chosen files. The control is controlled: update this in `onChange`.
   */
  value: ReadonlyArray<File>;
  /**
   * Called when the user chooses files, with the new list in `event.detail.value`. With `multiple`, the
   * new files are added after the ones in `value`; otherwise the chosen file replaces it.
   */
  onChange?: NonCancelableEventHandler<FileInputProps.ChangeDetail>;
  /**
   * Lets the user choose more than one file.
   */
  multiple?: boolean;
  /**
   * The file types the file chooser offers, as for the native `accept` attribute: extensions such as
   * `.pdf` or media types such as `image/*`, separated by commas. Browsers treat it as a hint, so check
   * the files you receive.
   */
  accept?: string;
  /**
   * - `button` shows a button with an upload icon and text.
   * - `icon` shows only the upload icon. Give it an `ariaLabel`, or `children` to name it.
   */
  variant?: FileInputProps.Variant;
  /**
   * The text of the button. Defaults to "Choose file", or "Choose files" with `multiple`.
   */
  children?: React.ReactNode;
  /**
   * Accessible name of the control, used instead of the button text.
   */
  ariaLabel?: string;
  /**
   * Marks the control as required for assistive technology.
   */
  ariaRequired?: boolean;
  /**
   * Prevents choosing files and removes the control from the tab order.
   */
  disabled?: boolean;
}

export namespace FileInputProps {
  export type Variant = 'button' | 'icon';

  export interface ChangeDetail {
    value: File[];
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the control.
     */
    focus(): void;
  }
}
