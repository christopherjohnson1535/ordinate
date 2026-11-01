// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface FlashbarProps extends BaseComponentProps {
  /**
   * The notifications to show, newest first. Each item is announced to screen readers when it appears and
   * again when its text changes.
   */
  items: ReadonlyArray<FlashbarProps.MessageDefinition>;
  /**
   * Collapses two or more items into a stack that shows only the first item, with a bar that counts the
   * items by type and expands the stack.
   */
  stackItems?: boolean;
  /**
   * Built-in text, for when the `I18nProvider` messages do not fit.
   */
  i18nStrings?: FlashbarProps.I18nStrings;
}

export namespace FlashbarProps {
  export type Type = 'success' | 'error' | 'warning' | 'info' | 'in-progress';

  export type AriaRole = 'alert' | 'status';

  export interface MessageDefinition {
    /**
     * The kind of notification. It sets the icon and the color of the edge. Defaults to `info`.
     */
    type?: Type;
    /**
     * A short summary, shown in bold before the content.
     */
    header?: React.ReactNode;
    /**
     * The message. It can hold a `ProgressBar` with the `flash` variant for an operation in progress.
     */
    content?: React.ReactNode;
    /**
     * An action shown beside the message, usually a `Button`.
     */
    action?: React.ReactNode;
    /**
     * Adds a close button. Remove the item from `items` in `onDismiss`.
     */
    dismissible?: boolean;
    /**
     * Called when the user clicks the close button.
     */
    onDismiss?: NonCancelableEventHandler;
    /**
     * Accessible name of the close button.
     */
    dismissLabel?: string;
    /**
     * Shows a spinner in place of the status icon, for an operation that is still running.
     */
    loading?: boolean;
    /**
     * A stable identifier for the item. Set it so the item keeps its place and state when items are added or
     * removed around it.
     */
    id?: string;
    /**
     * How urgently screen readers announce the item. `status` waits for the screen reader to finish what it
     * is reading; `alert` interrupts it, so keep it for problems the user must act on right away.
     */
    ariaRole?: AriaRole;
    /**
     * Accessible name of the status icon. It is read before the header, so it tells screen reader users the
     * kind of notification. Defaults to the name of the type, such as "Error".
     */
    statusIconAriaLabel?: string;
  }

  export interface I18nStrings {
    /**
     * Accessible name of the list of notifications.
     */
    ariaLabel?: string;
    /**
     * The text of the bar that expands and collapses a stack.
     */
    notificationBarText?: string;
    /**
     * Default accessible names of the status icons, by type.
     */
    successIconAriaLabel?: string;
    errorIconAriaLabel?: string;
    warningIconAriaLabel?: string;
    infoIconAriaLabel?: string;
    inProgressIconAriaLabel?: string;
    /**
     * The count of items of one type shown in the stack bar, such as "2 errors".
     */
    itemCountText?: (type: Type, count: number) => string;
  }
}
