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

export interface MultiselectProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The options to choose from. Put options in an `OptionGroup` to show them under a group label.
   * Only one level of grouping is supported.
   *
   * Each option and group can have:
   * * `value`: the value of the option. Also used to match `selectedOptions` to options.
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
  options?: MultiselectProps.Options;
  /**
   * The selected options, in the order they were chosen. The multiselect is controlled: update this in `onChange`.
   */
  selectedOptions: ReadonlyArray<MultiselectProps.Option>;
  /**
   * Called when the user selects or deselects options, with the new selection in `event.detail.selectedOptions`.
   */
  onChange?: NonCancelableEventHandler<MultiselectProps.ChangeDetail>;
  /**
   * Text shown in the trigger while no option is selected.
   */
  placeholder?: string;
  /**
   * Prevents opening the multiselect, removes it from the tab order and hides the remove buttons on tokens.
   */
  disabled?: boolean;
  /**
   * Prevents changes but keeps the multiselect focusable, so the selection can still be read.
   */
  readOnly?: boolean;
  /**
   * How the options are filtered:
   * * `none`: no filter input.
   * * `auto`: shows a filter input and hides options whose label, value, description,
   *   label tag or tags do not contain the text.
   * * `manual`: shows a filter input but shows every option. Filter them yourself in `onLoadItems`.
   */
  filteringType?: MultiselectProps.FilteringType;
  /**
   * Hint text in the filter input.
   */
  filteringPlaceholder?: string;
  /**
   * Accessible name of the filter input.
   */
  filteringAriaLabel?: string;
  /**
   * The number of tokens shown below the trigger. The rest are behind a "Show more" button.
   */
  tokenLimit?: number;
  /**
   * Hides the tokens below the trigger. Show the selection some other way, such as in a table.
   */
  hideTokens?: boolean;
  /**
   * Keeps the list open after the user selects an option, so several can be chosen in a row.
   */
  keepOpen?: boolean;
  /**
   * Adds a "Select all" row at the top of the list that selects or deselects every option shown.
   * While filtering, it applies only to the options that match.
   */
  enableSelectAll?: boolean;
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
  statusType?: MultiselectProps.StatusType;
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
   * Called when the multiselect needs options: when it opens, when the filter text changes, when
   * the user scrolls to the end of the list while `statusType` is `pending`, and when the user
   * clicks the recovery button.
   *
   * * `filteringText`: the current filter text.
   * * `firstPage`: load options from the start for this filter text.
   * * `samePage`: load the page that failed again.
   */
  onLoadItems?: NonCancelableEventHandler<MultiselectProps.LoadItemsDetail>;
  /**
   * Text the multiselect shows on its own:
   * * `selectAllText`: the label of the "Select all" row.
   * * `selectedCountText`: the trigger text while options are selected, such as "3 options selected".
   *   Passed as a fixed string, it is shown as is.
   * * `tokenLimitShowMore`: the button that shows the tokens hidden by `tokenLimit`.
   * * `tokenLimitShowFewer`: the button that hides them again.
   */
  i18nStrings?: MultiselectProps.I18nStrings;
  /**
   * Returns the accessible name of the remove button on an option's token, such as "Remove US East".
   */
  deselectAriaLabel?: (option: MultiselectProps.Option) => string;
  /**
   * Accessible name, for multiselects without a visible label.
   */
  ariaLabel?: string;
  /**
   * Called when focus moves into the multiselect from outside it.
   */
  onFocus?: NonCancelableEventHandler;
  /**
   * Called when focus leaves the multiselect.
   */
  onBlur?: NonCancelableEventHandler;
}

export namespace MultiselectProps {
  export type FilteringType = SharedFilteringType;

  export type StatusType = SharedStatusType;

  export interface Option extends OptionDefinition {}

  export interface OptionGroup extends OptionGroupDefinition {}

  export type Options = OptionsDefinition;

  export interface ChangeDetail {
    selectedOptions: ReadonlyArray<Option>;
  }

  export interface LoadItemsDetail extends SharedLoadItemsDetail {}

  export interface I18nStrings {
    selectAllText?: string;
    selectedCountText?: string;
    tokenLimitShowMore?: string;
    tokenLimitShowFewer?: string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the trigger without opening the list.
     */
    focus(): void;
  }
}
