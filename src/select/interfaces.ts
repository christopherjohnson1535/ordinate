// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import {
  FilteringType as SharedFilteringType,
  LoadItemsDetail as SharedLoadItemsDetail,
  OptionDefinition,
  OptionGroupDefinition,
  OptionsDefinition,
  StatusType as SharedStatusType,
} from '../internal/components/option-list/interfaces';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface SelectProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The options to choose from. Put options in an `OptionGroup` to show them under a group label.
   * Only one level of grouping is supported.
   *
   * Each option and group can have:
   * * `value`: the value of the option. Also used to match `selectedOption` to an option.
   * * `label`: the text shown for the option. Falls back to `value`.
   * * `description`: secondary text below the label.
   * * `labelTag`: a short text shown after the label, such as a size or a count.
   * * `tags`: a list of short texts shown below the description.
   * * `filteringTags`: more words to match when filtering, which are not shown.
   * * `disabled`: shows the option but prevents choosing it. A disabled group disables its options.
   * * `iconName`: a built-in icon shown before the label.
   * * `iconAriaLabel`: an accessible name for the icon.
   * * `lang`: the language of the label, as a BCP 47 tag.
   *
   * A group also has `options`, the options inside it.
   */
  options?: SelectProps.Options;
  /**
   * The selected option, or `null` when nothing is selected. The select is controlled:
   * update this in `onChange`.
   */
  selectedOption: SelectProps.Option | null;
  /**
   * Called when the user chooses a different option, with the option in `event.detail.selectedOption`.
   */
  onChange?: NonCancelableEventHandler<SelectProps.ChangeDetail>;
  /**
   * Text shown in the trigger while no option is selected.
   */
  placeholder?: string;
  /**
   * Prevents opening the select and removes it from the tab order.
   */
  disabled?: boolean;
  /**
   * Prevents opening the select but keeps it focusable, so the value can still be read.
   */
  readOnly?: boolean;
  /**
   * How the options are filtered:
   * * `none`: no filter input.
   * * `auto`: shows a filter input and hides options whose label, value, description,
   *   label tag or tags do not contain the text.
   * * `manual`: shows a filter input but shows every option. Filter them yourself in `onLoadItems`.
   */
  filteringType?: SelectProps.FilteringType;
  /**
   * Hint text in the filter input.
   */
  filteringPlaceholder?: string;
  /**
   * Accessible name of the filter input.
   */
  filteringAriaLabel?: string;
  /**
   * Shown in the list when there are no options and `statusType` is `finished` or `pending`.
   */
  empty?: React.ReactNode;
  /**
   * Shown in the list when filtering leaves no options.
   */
  noMatch?: React.ReactNode;
  /**
   * The state of loading options:
   * * `pending`: no request is running, but more options can be loaded. `onLoadItems` is called
   *   when the user scrolls to the end of the list.
   * * `loading`: a request is running. Shows `loadingText`.
   * * `finished`: all options are loaded. Shows `finishedText`, if set.
   * * `error`: the last request failed. Shows `errorText` and a `recoveryText` button that calls `onLoadItems`.
   */
  statusType?: SelectProps.StatusType;
  /**
   * Shown below the options while `statusType` is `loading`.
   */
  loadingText?: string;
  /**
   * Shown below the options when `statusType` is `finished`.
   */
  finishedText?: string;
  /**
   * Shown below the options when `statusType` is `error`. Say what failed.
   */
  errorText?: string;
  /**
   * Text of the button shown next to `errorText`. Clicking it calls `onLoadItems` with `samePage` set.
   */
  recoveryText?: string;
  /**
   * Accessible name of the icon next to `errorText`.
   */
  errorIconAriaLabel?: string;
  /**
   * Called when the select needs options: when it opens, when the filter text changes, when
   * the user scrolls to the end of the list while `statusType` is `pending`, and when the user
   * clicks the recovery button.
   *
   * * `filteringText`: the current filter text.
   * * `firstPage`: load options from the start for this filter text.
   * * `samePage`: load the page that failed again.
   */
  onLoadItems?: NonCancelableEventHandler<SelectProps.LoadItemsDetail>;
  /**
   * Accessible name, for selects without a visible label.
   */
  ariaLabel?: string;
  /**
   * Called when focus moves into the select from outside it.
   */
  onFocus?: NonCancelableEventHandler;
  /**
   * Called when focus leaves the select.
   */
  onBlur?: NonCancelableEventHandler;
}

export namespace SelectProps {
  export type FilteringType = SharedFilteringType;

  export type StatusType = SharedStatusType;

  export interface Option extends OptionDefinition {}

  export interface OptionGroup extends OptionGroupDefinition {}

  export type Options = OptionsDefinition;

  export interface ChangeDetail {
    selectedOption: Option;
  }

  export interface LoadItemsDetail extends SharedLoadItemsDetail {}

  export interface Ref {
    /**
     * Moves keyboard focus to the trigger without opening the list.
     */
    focus(): void;
  }
}
