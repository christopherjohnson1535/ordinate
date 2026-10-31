// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface AlertProps extends BaseComponentProps {
  /**
   * The kind of message. It sets the icon and the border color.
   */
  type?: AlertProps.Type;
  /**
   * A short summary of the message, shown in bold above the content.
   */
  header?: React.ReactNode;
  /**
   * The message.
   */
  children?: React.ReactNode;
  /**
   * An action shown beside the message, usually a `Button`.
   */
  action?: React.ReactNode;
  /**
   * Adds a close button. The alert is controlled: remove it from the page in `onDismiss`.
   */
  dismissible?: boolean;
  /**
   * Called when the user clicks the close button.
   */
  onDismiss?: NonCancelableEventHandler;
  /**
   * Accessible name of the close button.
   */
  dismissAriaLabel?: string;
  /**
   * Accessible name of the status icon, such as "Error". Without it the icon is decorative, so set it when the
   * header and content do not make the type of message clear.
   */
  statusIconAriaLabel?: string;
}

export namespace AlertProps {
  export type Type = 'info' | 'success' | 'warning' | 'error';

  export interface Ref {
    /**
     * Moves keyboard focus to the alert so screen readers read it. Use it after showing an alert in response
     * to something the user did, or wrap the alert in a `LiveRegion`.
     */
    focus(): void;
  }
}
