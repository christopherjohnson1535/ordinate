// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import {
  LoadItemsDetail as SharedLoadItemsDetail,
  OptionDefinition,
  OptionGroupDefinition,
  OptionsDefinition,
  StatusType as SharedStatusType,
} from '../internal/components/option-list/interfaces';
import { FormFieldControlProps } from '../internal/context/form-field-context';
import { NonCancelableEventHandler } from '../internal/events';

export interface AutosuggestProps extends BaseComponentProps, FormFieldControlProps {
  /**
   * The text in the input. The autosuggest is controlled: update this in `onChange`.
   */
  value: string;
  /**
   * Called when the text changes, as the user types or chooses a suggestion, with the text in `event.detail.value`.
   */
  onChange?: NonCancelableEventHandler<AutosuggestProps.ChangeDetail>;
  /**
   * The suggestions. Put suggestions in an `OptionGroup` to show them under a group label.
   * Only one level of grouping is supported.
   *
   * Each suggestion and group can have:
   * * `value`: the text that goes into the input when the suggestion is chosen.
   * * `label`: the text shown for the suggestion. Falls back to `value`.
   * * `description`: secondary text below the label.
   * * `labelTag`: a short text shown after the label.
   * * `tags`: a list of short texts shown below the description.
   * * `filteringTags`: more words to match when filtering, which are not shown.
   * * `disabled`: shows the suggestion but prevents choosing it. A disabled group disables its suggestions.
   * * `iconName`: a built-in icon shown before the label.
   * * `iconAriaLabel`: an accessible name for the icon.
   * * `lang`: the language of the label, as a BCP 47 tag.
   *
   * A group also has `options`, the suggestions inside it.
   */
  options?: AutosuggestProps.Options;
  /**
   * Called when the user chooses a suggestion or the entered text option. `event.detail.value` is the
   * chosen text and `event.detail.selectedOption` is the suggestion, or undefined for the entered text.
   */
  onSelect?: NonCancelableEventHandler<AutosuggestProps.SelectDetail>;
  /**
   * How the suggestions are filtered:
   * * `auto`: hides suggestions whose label, value, description, label tag or tags do not contain the text.
   * * `manual`: shows every suggestion. Filter them yourself in `onLoadItems` or `onChange`.
   */
  filteringType?: AutosuggestProps.FilteringType;
  /**
   * Returns the label of the option at the top of the list that uses the text as typed, such as `Use: "east"`.
   */
  enteredTextLabel?: (value: string) => string;
  /**
   * Hides the option that uses the text as typed, so only suggestions can be chosen from the list.
   */
  hideEnteredTextOption?: boolean;
  /**
   * Shown in the list when there are no suggestions and `statusType` is `finished` or `pending`.
   */
  empty?: React.ReactNode;
  /**
   * The state of loading suggestions:
   * * `pending`: no request is running, but more suggestions can be loaded. `onLoadItems` is called
   *   when the user scrolls to the end of the list.
   * * `loading`: a request is running. Shows `loadingText`.
   * * `finished`: all suggestions are loaded. Shows `finishedText`, if set.
   * * `error`: the last request failed. Shows `errorText` and a `recoveryText` button that calls `onLoadItems`.
   */
  statusType?: AutosuggestProps.StatusType;
  /**
   * Shown below the suggestions while `statusType` is `loading`.
   */
  loadingText?: string;
  /**
   * Shown below the suggestions when `statusType` is `finished`.
   */
  finishedText?: string;
  /**
   * Shown below the suggestions when `statusType` is `error`. Say what failed.
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
   * Called when the autosuggest needs suggestions: when the text changes, when the user scrolls
   * to the end of the list while `statusType` is `pending`, and when the user clicks the recovery button.
   *
   * * `filteringText`: the text in the input.
   * * `firstPage`: load suggestions from the start for this text.
   * * `samePage`: load the page that failed again.
   */
  onLoadItems?: NonCancelableEventHandler<AutosuggestProps.LoadItemsDetail>;
  /**
   * Hint text shown while the input is empty. Do not use it in place of a label.
   */
  placeholder?: string;
  /**
   * Prevents changes and removes the input from the tab order.
   */
  disabled?: boolean;
  /**
   * Prevents changes but keeps the text focusable and selectable.
   */
  readOnly?: boolean;
  /**
   * The native `name` attribute.
   */
  name?: string;
  /**
   * Accessible name, for an autosuggest without a visible label.
   */
  ariaLabel?: string;
  /**
   * Marks the input as required for assistive technology.
   */
  ariaRequired?: boolean;
  /**
   * Called when focus moves into the autosuggest from outside it.
   */
  onFocus?: NonCancelableEventHandler;
  /**
   * Called when focus leaves the autosuggest.
   */
  onBlur?: NonCancelableEventHandler;
}

export namespace AutosuggestProps {
  export type FilteringType = 'auto' | 'manual';

  export type StatusType = SharedStatusType;

  export interface Option extends OptionDefinition {}

  export interface OptionGroup extends OptionGroupDefinition {}

  export type Options = OptionsDefinition;

  export interface ChangeDetail {
    value: string;
  }

  export interface SelectDetail {
    value: string;
    selectedOption?: Option;
  }

  export interface LoadItemsDetail extends SharedLoadItemsDetail {}

  export interface Ref {
    /**
     * Moves keyboard focus to the input.
     */
    focus(): void;
    /**
     * Selects all of the input's text.
     */
    select(): void;
  }
}
