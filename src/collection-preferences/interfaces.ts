// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { NonCancelableEventHandler } from '../internal/events';

export interface CollectionPreferencesProps<CustomPreferenceType = unknown> extends BaseComponentProps {
  /**
   * The heading of the modal and the accessible name of the settings button.
   */
  title?: string;
  /**
   * The text of the button that applies the changes.
   */
  confirmLabel?: string;
  /**
   * The text of the button that discards the changes.
   */
  cancelLabel?: string;
  /**
   * Disables the settings button, for example while the collection loads.
   */
  disabled?: boolean;
  /**
   * The preferences in effect. The modal starts from these values each time it opens, and the user's
   * changes reach the application only through `onConfirm`.
   */
  preferences?: CollectionPreferencesProps.Preferences<CustomPreferenceType>;
  /**
   * Called when the user confirms, with every preference in `event.detail`. Preferences without a
   * control in the modal are passed through unchanged.
   */
  onConfirm?: NonCancelableEventHandler<CollectionPreferencesProps.Preferences<CustomPreferenceType>>;
  /**
   * Called when the user closes the modal without confirming. The changes are discarded.
   */
  onCancel?: NonCancelableEventHandler;
  /**
   * Shows a choice of page sizes as radio buttons.
   * * `title` (optional): the label of the choice.
   * * `options`: the sizes, each with a numeric `value` and an optional `label`.
   */
  pageSizePreference?: CollectionPreferencesProps.PageSizePreference;
  /**
   * Shows a checkbox for wrapping long text onto several lines. `label` and `description` are optional.
   */
  wrapLinesPreference?: CollectionPreferencesProps.CheckboxPreference;
  /**
   * Shows a checkbox for shading every other row. `label` and `description` are optional.
   */
  stripedRowsPreference?: CollectionPreferencesProps.CheckboxPreference;
  /**
   * Shows a checkbox for compact content density. `label` and `description` are optional.
   */
  contentDensityPreference?: CollectionPreferencesProps.CheckboxPreference;
  /**
   * Shows how many columns stay in place at the start and at the end while the content scrolls
   * sideways. Each of `firstColumns` and `lastColumns` has an optional `title` and `description`, and
   * `options`, each with a numeric `value` and a `label`.
   */
  stickyColumnsPreference?: CollectionPreferencesProps.StickyColumnsPreference;
  /**
   * Shows the columns as a list where each one can be shown, hidden and moved.
   * * `title` and `description` (optional): text above the list.
   * * `options`: the columns, each with an `id`, a `label` and `alwaysVisible` for columns that cannot be hidden.
   * * `i18nStrings` (optional): replaces the built-in accessible names and announcements.
   *
   * The order and visibility come from `preferences.contentDisplay`. Columns missing from it are added at
   * the end, hidden.
   */
  contentDisplayPreference?: CollectionPreferencesProps.ContentDisplayPreference;
  /**
   * Renders controls for preferences of your own. It receives the current value of `preferences.custom`
   * in the modal and a function to change it. The value is applied with the others on confirm.
   */
  customPreference?: (
    customValue: CustomPreferenceType | undefined,
    setCustomValue: (value: CustomPreferenceType) => void
  ) => React.ReactNode;
}

export namespace CollectionPreferencesProps {
  export type ContentDensity = 'comfortable' | 'compact';

  export interface Preferences<CustomPreferenceType = unknown> {
    pageSize?: number;
    wrapLines?: boolean;
    stripedRows?: boolean;
    contentDensity?: ContentDensity;
    stickyColumns?: StickyColumns;
    contentDisplay?: ReadonlyArray<ContentDisplayItem>;
    /**
     * The visible column IDs, for collections that only toggle columns. Passed through unchanged.
     */
    visibleContent?: ReadonlyArray<string>;
    custom?: CustomPreferenceType;
  }

  export interface StickyColumns {
    first?: number;
    last?: number;
  }

  export interface ContentDisplayItem {
    id: string;
    visible: boolean;
  }

  export interface PageSizePreference {
    title?: string;
    options: ReadonlyArray<PageSizeOption>;
  }

  export interface PageSizeOption {
    value: number;
    label?: string;
  }

  export interface CheckboxPreference {
    label?: string;
    description?: string;
  }

  export interface StickyColumnsPreference {
    firstColumns?: StickyColumnPreference;
    lastColumns?: StickyColumnPreference;
  }

  export interface StickyColumnPreference {
    title?: string;
    description?: string;
    options: ReadonlyArray<StickyColumnOption>;
  }

  export interface StickyColumnOption {
    value: number;
    label: string;
  }

  export interface ContentDisplayPreference {
    title?: string;
    description?: string;
    options: ReadonlyArray<ContentDisplayOption>;
    i18nStrings?: ContentDisplayI18nStrings;
  }

  export interface ContentDisplayOption {
    id: string;
    label: string;
    /**
     * Keeps the column shown. Its switch is turned on and cannot be changed.
     */
    alwaysVisible?: boolean;
  }

  export interface ContentDisplayI18nStrings {
    /**
     * Accessible name of the button that moves a column one place up.
     */
    moveUpAriaLabel?: (label: string) => string;
    /**
     * Accessible name of the button that moves a column one place down.
     */
    moveDownAriaLabel?: (label: string) => string;
    /**
     * Announced after a column moves, with its new position counting from 1.
     */
    itemMovedAnnouncement?: (label: string, position: number, total: number) => string;
  }
}
