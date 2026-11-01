// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface ProgressBarProps extends BaseComponentProps {
  /**
   * How far the operation has got, from 0 to 100. Values outside the range are clamped.
   */
  value?: number;
  /**
   * What is in progress, shown above the bar. It names the progress bar for screen readers.
   */
  label?: React.ReactNode;
  /**
   * Supporting text shown below the label.
   */
  description?: React.ReactNode;
  /**
   * More detail shown below the bar, such as the time remaining.
   */
  additionalInfo?: React.ReactNode;
  /**
   * The state of the operation. `success` and `error` replace the bar with a status and `resultText`, and
   * announce the result to screen readers.
   */
  status?: ProgressBarProps.Status;
  /**
   * The text shown with the status once the operation has finished.
   */
  resultText?: React.ReactNode;
  /**
   * Shows a button next to the result, such as "Retry" after an error. Handle it with `onResultButtonClick`.
   */
  resultButtonText?: string;
  /**
   * Called when the user clicks the result button.
   */
  onResultButtonClick?: NonCancelableEventHandler;
  /**
   * Where the progress bar is placed.
   *
   * - `standalone` is for a progress bar on its own in a page or container.
   * - `flash` is for a progress bar inside a `Flashbar` item.
   * - `key-value` is for a progress bar that is the value of a key-value pair. The label is drawn like a key.
   */
  variant?: ProgressBarProps.Variant;
  /**
   * Accessible name of the progress bar, when there is no `label`.
   */
  ariaLabel?: string;
  /**
   * ID of an element that names the progress bar, used instead of `label`.
   */
  ariaLabelledby?: string;
  /**
   * IDs of elements that describe the progress bar, added to the description and additional information.
   */
  ariaDescribedby?: string;
}

export namespace ProgressBarProps {
  export type Status = 'in-progress' | 'success' | 'error';

  export type Variant = 'standalone' | 'flash' | 'key-value';
}
