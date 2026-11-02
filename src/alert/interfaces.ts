// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface AlertProps extends BaseComponentProps {
  /**
   * The kind of message, named like the states: `note`, `complete`, `caution` or `fault`. It sets the color of
   * the construction line, the icon and the label in the margin. The old names (`info`, `success`, `warning`
   * and `error`) still work with a warning until the next major version.
   */
  type?: AlertProps.Type | AlertProps.LegacyType;
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
   * Accessible name of the status icon. The kind of message is already named in the margin, so the icon is
   * decorative unless you set this.
   */
  statusIconAriaLabel?: string;
  /**
   * The labels set in the margin for each kind of message. They default to Note, Complete, Caution and Fault.
   */
  i18nStrings?: AlertProps.I18nStrings;
}

export namespace AlertProps {
  export type Type = 'note' | 'complete' | 'caution' | 'fault';

  /**
   * Deprecated: the old names of the kinds. Use `Type`.
   */
  export type LegacyType = 'info' | 'success' | 'warning' | 'error';

  export interface I18nStrings {
    noteLabel?: string;
    completeLabel?: string;
    cautionLabel?: string;
    faultLabel?: string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the alert so screen readers read it. Use it after showing an alert in response
     * to something the user did, or wrap the alert in a `LiveRegion`.
     */
    focus(): void;
  }
}
