// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface DialogProps extends BaseComponentProps {
  /**
   * The title of the dialog. It also becomes the dialog's accessible name.
   */
  header?: React.ReactNode;
  /**
   * Main content of the dialog.
   */
  children?: React.ReactNode;
  /**
   * Content of the footer, usually the actions. Without it, there is no footer.
   */
  footer?: React.ReactNode;
  /**
   * Called when the user asks to close the dialog with the close button or the Escape key.
   * `event.detail.reason` is `closeButton` or `keyboard`. Remove the dialog from the page here.
   *
   * The dialog moves focus to itself when it mounts. When it unmounts with focus inside it,
   * focus goes back to the element that had it before.
   */
  onDismiss?: NonCancelableEventHandler<DialogProps.DismissDetail>;
  /**
   * Accessible name of the close button.
   */
  dismissAriaLabel?: string;
  /**
   * Accessible name of the dialog, for dialogs without a `header`.
   */
  ariaLabel?: string;
}

export namespace DialogProps {
  export type DismissReason = 'closeButton' | 'keyboard';

  export interface DismissDetail {
    reason: DismissReason;
  }
}
