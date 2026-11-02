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
   * Collapses two or more items into a stack that shows only the first item. Under it, a summary row keys
   * each type with a count, beside a button that shows every item.
   */
  stackItems?: boolean;
  /**
   * Built-in text, for when the `I18nProvider` messages do not fit.
   */
  i18nStrings?: FlashbarProps.I18nStrings;
}

export namespace FlashbarProps {
  export type Type = 'note' | 'complete' | 'caution' | 'fault';

  /**
   * Deprecated: the old names of the types. Use `Type`. `in-progress` becomes a `note` that is `loading`.
   */
  export type LegacyType = 'info' | 'success' | 'warning' | 'error' | 'in-progress';

  /**
   * What the summary of a collapsed stack counts: a type, or `underway` for the items that are loading.
   */
  export type CountType = Type | 'underway';

  export type AriaRole = 'alert' | 'status';

  export interface MessageDefinition {
    /**
     * The kind of notification, named like Alert's types: `note`, `complete`, `caution` or `fault`. It sets the
     * color of the opening line, the icon and the word in the margin. Defaults to `note`. The old names
     * (`info`, `success`, `warning`, `error` and `in-progress`) still work with a warning until the next major
     * version.
     */
    type?: Type | LegacyType;
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
     * Shows the underway spinner in place of the status icon, with "Underway" in the margin, for an operation
     * that is still running.
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
     * Accessible name of the status icon. The kind of notification is already named in the margin, so the
     * icon is decorative unless you set this.
     */
    statusIconAriaLabel?: string;
  }

  export interface I18nStrings {
    /**
     * Accessible name of the list of notifications.
     */
    ariaLabel?: string;
    /**
     * Accessible name of the summary row under a collapsed stack.
     */
    notificationBarText?: string;
    /**
     * The word in the margin of an item that is loading. Defaults to "Underway".
     */
    underwayLabel?: string;
    /**
     * The text of the button that shows every item of a stack, given the number of items, such as "Show all 3".
     */
    showAllText?: (count: number) => string;
    /**
     * The text of the button that collapses an expanded stack again.
     */
    showFewerText?: string;
    /**
     * Deprecated: accessible names of the status icons, by the old type names. The margin names the type, so
     * the icons are decorative unless one of these, or an item's `statusIconAriaLabel`, is set.
     */
    successIconAriaLabel?: string;
    errorIconAriaLabel?: string;
    warningIconAriaLabel?: string;
    infoIconAriaLabel?: string;
    inProgressIconAriaLabel?: string;
    /**
     * The count of items of one type shown in the summary of a collapsed stack, such as "2 faults".
     */
    itemCountText?: (type: CountType, count: number) => string;
  }
}
