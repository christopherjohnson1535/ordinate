// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useInternalI18n } from '../internal/i18n/context';
import { PropertyFilterProps } from './interfaces';

type Operator = PropertyFilterProps.ComparisonOperator;
type I18nStrings = PropertyFilterProps.I18nStrings;
type FormattedToken = PropertyFilterProps.FormattedToken;

// The entries of `i18nStrings` that are plain text rather than functions.
type TextKey = {
  [Key in keyof I18nStrings]-?: I18nStrings[Key] extends string | undefined ? Key : never;
}[keyof I18nStrings];

const operatorKeys: Record<Operator, TextKey> = {
  '=': 'operatorEqualsText',
  '!=': 'operatorDoesNotEqualText',
  ':': 'operatorContainsText',
  '!:': 'operatorDoesNotContainText',
  '>': 'operatorGreaterText',
  '>=': 'operatorGreaterOrEqualText',
  '<': 'operatorLessText',
  '<=': 'operatorLessOrEqualText',
  '^': 'operatorStartsWithText',
  '!^': 'operatorDoesNotStartWithText',
};

/**
 * Every built-in string of the property filter, resolved from `i18nStrings`, the `I18nProvider` and English.
 */
export interface PropertyFilterStrings {
  filteringAriaLabel: string;
  filteringPlaceholder: string;
  operatorName(operator: Operator): string;
  operationText(operation: PropertyFilterProps.Operation): string;
  tokenOperatorAriaLabel: string;
  groupPropertiesText: string;
  groupValuesText: string;
  operatorsText: string;
  groupValuesLabel(property: PropertyFilterProps.FilteringProperty): string;
  enteredTextLabel(text: string): string;
  clearFiltersText: string;
  editTokenHeader: string;
  propertyText: string;
  operatorText: string;
  valueText: string;
  allPropertiesLabel: string;
  applyActionText: string;
  cancelActionText: string;
  dismissAriaLabel: string;
  tokenAriaLabel(token: FormattedToken): string;
  removeTokenButtonAriaLabel(token: FormattedToken): string;
  tokenLimitShowMore(count: number): string;
  tokenLimitShowFewer: string;
  errorIconAriaLabel: string;
}

export function usePropertyFilterStrings(
  strings: I18nStrings = {},
  props: { filteringAriaLabel?: string; filteringPlaceholder?: string }
): PropertyFilterStrings {
  const i18n = useInternalI18n('property-filter');
  const text = (key: TextKey) => i18n(key, strings[key]) ?? '';

  const tokenAriaLabel = (token: FormattedToken) =>
    strings.tokenAriaLabel?.(token) ??
    i18n('tokenAriaLabel', undefined, {
      hasProperty: token.propertyLabel === undefined ? 'false' : 'true',
      propertyLabel: token.propertyLabel ?? '',
      // The name repeats the visible text, operator symbol included, so voice control users can say
      // what they see. Screen readers announce the symbols themselves.
      operator: token.operator,
      showOperator: token.propertyLabel !== undefined || token.operator !== ':' ? 'true' : 'false',
      value: token.value,
    }) ??
    '';

  return {
    filteringAriaLabel: i18n('filteringAriaLabel', props.filteringAriaLabel) ?? '',
    filteringPlaceholder: i18n('filteringPlaceholder', props.filteringPlaceholder) ?? '',
    operatorName: operator => text(operatorKeys[operator]),
    operationText: operation => text(operation === 'and' ? 'operationAndText' : 'operationOrText'),
    tokenOperatorAriaLabel: text('tokenOperatorAriaLabel'),
    groupPropertiesText: text('groupPropertiesText'),
    groupValuesText: text('groupValuesText'),
    operatorsText: text('operatorsText'),
    groupValuesLabel: property =>
      property.groupValuesLabel ??
      strings.groupValuesLabel?.(property) ??
      i18n('groupValuesLabel', undefined, { propertyLabel: property.propertyLabel }) ??
      '',
    enteredTextLabel: value =>
      strings.enteredTextLabel?.(value) ?? i18n('enteredTextLabel', undefined, { value }) ?? '',
    clearFiltersText: text('clearFiltersText'),
    editTokenHeader: text('editTokenHeader'),
    propertyText: text('propertyText'),
    operatorText: text('operatorText'),
    valueText: text('valueText'),
    allPropertiesLabel: text('allPropertiesLabel'),
    applyActionText: text('applyActionText'),
    cancelActionText: text('cancelActionText'),
    dismissAriaLabel: text('dismissAriaLabel'),
    tokenAriaLabel,
    removeTokenButtonAriaLabel: token =>
      strings.removeTokenButtonAriaLabel?.(token) ??
      i18n('removeTokenButtonAriaLabel', undefined, { token: tokenAriaLabel(token) }) ??
      '',
    tokenLimitShowMore: count => i18n('tokenLimitShowMore', strings.tokenLimitShowMore, { count }) ?? '',
    tokenLimitShowFewer: text('tokenLimitShowFewer'),
    errorIconAriaLabel: text('errorIconAriaLabel'),
  };
}
