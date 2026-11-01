// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../internal/base-component';
import { StatusType as SharedStatusType } from '../internal/components/option-list/interfaces';
import { NonCancelableEventHandler } from '../internal/events';

export interface PropertyFilterProps extends BaseComponentProps {
  /**
   * The filters and how they combine. The property filter is controlled: update this in `onChange`.
   *
   * * `tokens`: the filters. Each has an `operator`, a `value` and, unless it is free text, a `propertyKey`.
   * * `operation`: `and` to match items that pass every filter, `or` to match items that pass any.
   */
  query: PropertyFilterProps.Query;
  /**
   * Called when the user adds, edits or removes a filter, changes the operation or clears the filters,
   * with the new query in `event.detail`.
   */
  onChange?: NonCancelableEventHandler<PropertyFilterProps.Query>;
  /**
   * The properties the user can filter by. Each property has:
   * * `key`: the identifier stored in a token's `propertyKey`.
   * * `propertyLabel`: the name shown to the user. Typing it in the input selects the property.
   * * `groupValuesLabel`: the heading above this property's value suggestions, such as "Status values".
   * * `operators`: the operators the property allows besides its default operator.
   * * `defaultOperator`: the operator used when the user picks a value without one. Defaults to `=`.
   * * `group`: a heading to list the property under, instead of the shared "Properties" heading.
   */
  filteringProperties: ReadonlyArray<PropertyFilterProps.FilteringProperty>;
  /**
   * Values to suggest for each property. Each option has a `propertyKey`, the `value` stored in the
   * token and an optional `label` shown in its place.
   */
  filteringOptions?: ReadonlyArray<PropertyFilterProps.FilteringOption>;
  /**
   * Hint text shown while the input is empty.
   */
  filteringPlaceholder?: string;
  /**
   * Accessible name of the input. Say what is being filtered, such as "Find instances".
   */
  filteringAriaLabel?: string;
  /**
   * A short result count shown next to the input while there are filters, such as "12 matches".
   * Changes are announced to screen readers.
   */
  countText?: string;
  /**
   * Allows only filters on a property. Text that does not name a property cannot become a filter.
   */
  disableFreeTextFiltering?: boolean;
  /**
   * Hides the control between filters that switches the operation between `and` and `or`.
   */
  hideOperations?: boolean;
  /**
   * Shows only this many filters, with a button to show the rest.
   */
  tokenLimit?: number;
  /**
   * Prevents changes and removes the property filter from the tab order.
   */
  disabled?: boolean;
  /**
   * Positions the suggestions and the filter editor against the viewport, so that a container with
   * hidden overflow, such as a table or a modal body, cannot clip them.
   */
  expandToViewport?: boolean;
  /**
   * Set when `filteringProperties` is not complete and more properties come from `onLoadItems`.
   * `onLoadItems` is then also called while the user is typing a property name.
   */
  asyncProperties?: boolean;
  /**
   * Called when the property filter needs suggestions: when the user types or opens the suggestions,
   * when they scroll to the end of the list while `filteringStatusType` is `pending`, and when they
   * click the recovery button.
   *
   * * `filteringProperty`: the property whose values are needed, or undefined while no property is chosen.
   * * `filteringOperator`: the operator typed after the property, if any.
   * * `filteringText`: the value text typed so far, or the whole text when no property is chosen.
   * * `firstPage`: load suggestions from the start for this text.
   * * `samePage`: load the page that failed again.
   */
  onLoadItems?: NonCancelableEventHandler<PropertyFilterProps.LoadItemsDetail>;
  /**
   * The state of loading suggestions:
   * * `pending`: more suggestions can be loaded when the user scrolls to the end of the list.
   * * `loading`: a request is running. Shows `filteringLoadingText`.
   * * `finished`: all suggestions are loaded. Shows `filteringFinishedText`, if set.
   * * `error`: the last request failed. Shows `filteringErrorText` and a `filteringRecoveryText` button.
   */
  filteringStatusType?: PropertyFilterProps.StatusType;
  /**
   * Shown below the suggestions while `filteringStatusType` is `loading`.
   */
  filteringLoadingText?: string;
  /**
   * Shown below the suggestions when `filteringStatusType` is `finished`.
   */
  filteringFinishedText?: string;
  /**
   * Shown below the suggestions when `filteringStatusType` is `error`. Say what failed.
   */
  filteringErrorText?: string;
  /**
   * Text of the button shown next to `filteringErrorText`. Clicking it calls `onLoadItems` with `samePage` set.
   */
  filteringRecoveryText?: string;
  /**
   * Shown in the suggestions list when there is nothing to suggest.
   */
  filteringEmpty?: React.ReactNode;
  /**
   * Content placed before the input on the same line, such as a select that picks a saved filter set.
   */
  customControl?: React.ReactNode;
  /**
   * Content shown after the filters in place of the "Clear filters" button, such as a button dropdown
   * with more actions. Clear the filters yourself from it if you still offer that.
   */
  customFilterActions?: React.ReactNode;
  /**
   * Text the property filter shows on its own. Every entry is optional and falls back to English.
   *
   * * Operator names, shown in the suggestions and the filter editor: `operatorEqualsText`,
   *   `operatorDoesNotEqualText`, `operatorContainsText`, `operatorDoesNotContainText`,
   *   `operatorGreaterText`, `operatorGreaterOrEqualText`, `operatorLessText`, `operatorLessOrEqualText`,
   *   `operatorStartsWithText` and `operatorDoesNotStartWithText`.
   * * `operationAndText` and `operationOrText`: the names of the two operations.
   * * `tokenOperatorAriaLabel`: accessible name of the control that switches the operation.
   * * `groupPropertiesText`, `groupValuesText` and `operatorsText`: headings in the suggestions.
   * * `groupValuesLabel`: returns the heading above a property's values when it has no `groupValuesLabel`.
   * * `enteredTextLabel`: returns the label of the suggestion that uses the typed text, such as `Use: "east"`.
   * * `clearFiltersText`: the button that removes every filter.
   * * `editTokenHeader`: the title of the filter editor.
   * * `propertyText`, `operatorText` and `valueText`: the labels of the editor's fields.
   * * `allPropertiesLabel`: the editor's property option for a free text filter.
   * * `applyActionText` and `cancelActionText`: the editor's buttons.
   * * `dismissAriaLabel`: accessible name of the editor's close button.
   * * `tokenAriaLabel`: returns the accessible name of a filter, such as "Status equals running".
   * * `removeTokenButtonAriaLabel`: returns the accessible name of a filter's remove button.
   * * `tokenLimitShowMore` and `tokenLimitShowFewer`: the buttons that show and hide filters past `tokenLimit`.
   * * `errorIconAriaLabel`: accessible name of the icon next to `filteringErrorText`.
   */
  i18nStrings?: PropertyFilterProps.I18nStrings;
}

export namespace PropertyFilterProps {
  /**
   * The operators a filter can use: equals, does not equal, contains, does not contain, greater than,
   * less than, greater than or equal, less than or equal, starts with and does not start with.
   */
  export type ComparisonOperator = '=' | '!=' | ':' | '!:' | '>' | '<' | '>=' | '<=' | '^' | '!^';

  export type Operation = 'and' | 'or';

  export type StatusType = SharedStatusType;

  export interface Token {
    /**
     * The property the filter applies to, or undefined for a free text filter that matches any property.
     */
    propertyKey?: string;
    operator: ComparisonOperator;
    value: string;
  }

  export interface Query {
    tokens: ReadonlyArray<Token>;
    operation: Operation;
  }

  export interface FilteringProperty {
    key: string;
    propertyLabel: string;
    groupValuesLabel?: string;
    operators?: ReadonlyArray<ComparisonOperator>;
    defaultOperator?: ComparisonOperator;
    group?: string;
  }

  export interface FilteringOption {
    propertyKey: string;
    value: string;
    label?: string;
  }

  export interface LoadItemsDetail {
    filteringProperty?: FilteringProperty;
    filteringOperator?: ComparisonOperator;
    filteringText: string;
    firstPage: boolean;
    samePage: boolean;
  }

  /**
   * A filter as it is shown to the user, passed to the functions in `i18nStrings` that name a filter.
   */
  export interface FormattedToken {
    /**
     * The property's label, or undefined for a free text filter.
     */
    propertyLabel?: string;
    operator: ComparisonOperator;
    /**
     * The operator's name, such as "Equals".
     */
    operatorText: string;
    /**
     * The value's label from `filteringOptions`, or the value itself.
     */
    value: string;
  }

  export interface I18nStrings {
    operatorEqualsText?: string;
    operatorDoesNotEqualText?: string;
    operatorContainsText?: string;
    operatorDoesNotContainText?: string;
    operatorGreaterText?: string;
    operatorGreaterOrEqualText?: string;
    operatorLessText?: string;
    operatorLessOrEqualText?: string;
    operatorStartsWithText?: string;
    operatorDoesNotStartWithText?: string;
    operationAndText?: string;
    operationOrText?: string;
    tokenOperatorAriaLabel?: string;
    groupPropertiesText?: string;
    groupValuesText?: string;
    operatorsText?: string;
    groupValuesLabel?: (property: FilteringProperty) => string;
    enteredTextLabel?: (text: string) => string;
    clearFiltersText?: string;
    editTokenHeader?: string;
    propertyText?: string;
    operatorText?: string;
    valueText?: string;
    allPropertiesLabel?: string;
    applyActionText?: string;
    cancelActionText?: string;
    dismissAriaLabel?: string;
    tokenAriaLabel?: (token: FormattedToken) => string;
    removeTokenButtonAriaLabel?: (token: FormattedToken) => string;
    tokenLimitShowMore?: string;
    tokenLimitShowFewer?: string;
    errorIconAriaLabel?: string;
  }

  export interface Ref {
    /**
     * Moves keyboard focus to the input.
     */
    focus(): void;
  }
}
