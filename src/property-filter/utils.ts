// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { PropertyFilterProps } from './interfaces';

type Operator = PropertyFilterProps.ComparisonOperator;
type FilteringProperty = PropertyFilterProps.FilteringProperty;
type FilteringOption = PropertyFilterProps.FilteringOption;
type Token = PropertyFilterProps.Token;

/**
 * Operators of a filter that is not tied to a property.
 */
export const freeTextOperators: ReadonlyArray<Operator> = [':', '!:'];

/**
 * Wraps an operator in left-to-right isolate marks. Operators are only punctuation, which right-to-left
 * text would otherwise turn around, showing `!=` as `=!`.
 */
export function isolateOperator(operator: Operator): string {
  return `\u2066${operator}\u2069`;
}

export function getDefaultOperator(property: FilteringProperty): Operator {
  return property.defaultOperator ?? '=';
}

/**
 * The operators a property allows, starting with its default operator.
 */
export function getAllowedOperators(property: FilteringProperty | undefined): ReadonlyArray<Operator> {
  if (!property) {
    return freeTextOperators;
  }
  return Array.from(new Set([getDefaultOperator(property), ...(property.operators ?? [])]));
}

export function findProperty(
  properties: ReadonlyArray<FilteringProperty>,
  key: string | undefined
): FilteringProperty | undefined {
  return key === undefined ? undefined : properties.find(property => property.key === key);
}

/**
 * The property whose label starts the text, ignoring case. The longest label wins, so "Instance type"
 * is found in "Instance type = large" even when there is also an "Instance" property.
 */
export function matchProperty(
  properties: ReadonlyArray<FilteringProperty>,
  text: string
): FilteringProperty | undefined {
  const lower = text.toLowerCase();
  let match: FilteringProperty | undefined;
  for (const property of properties) {
    const label = property.propertyLabel.toLowerCase();
    if (label !== '' && lower.startsWith(label) && label.length > (match?.propertyLabel.length ?? 0)) {
      match = property;
    }
  }
  return match;
}

/**
 * The operator that starts the text after any leading spaces. The longest operator wins, so `>=` is
 * read as one operator rather than `>` followed by a value.
 */
export function matchOperator(operators: ReadonlyArray<Operator>, text: string): Operator | undefined {
  const trimmed = text.trimStart();
  let match: Operator | undefined;
  for (const operator of operators) {
    if (trimmed.startsWith(operator) && operator.length > (match?.length ?? 0)) {
      match = operator;
    }
  }
  return match;
}

/**
 * The text, trimmed, when it could still grow into one of the operators, such as `!` for `!=`.
 * Returns an empty string for blank text and undefined when no operator starts with it.
 */
export function matchOperatorPrefix(operators: ReadonlyArray<Operator>, text: string): string | undefined {
  const trimmed = text.trim();
  if (trimmed === '') {
    return '';
  }
  return operators.some(operator => operator.startsWith(trimmed)) ? trimmed : undefined;
}

/**
 * What the user has typed so far:
 * * `property`: a property, an operator and the start of a value, as in "Status = run".
 * * `operator`: a property and possibly the start of an operator, as in "Status !".
 * * `free-text`: anything else, possibly starting with a free text operator, as in "!: web".
 */
export type ParsedText =
  | { step: 'property'; property: FilteringProperty; operator: Operator; value: string }
  | { step: 'operator'; property: FilteringProperty; operatorPrefix: string }
  | { step: 'free-text'; operator?: Operator; value: string };

function textAfterOperator(text: string, operator: Operator): string {
  return text.trimStart().slice(operator.length).trimStart();
}

export function parseText(text: string, properties: ReadonlyArray<FilteringProperty>): ParsedText {
  const property = matchProperty(properties, text);
  if (property) {
    const rest = text.slice(property.propertyLabel.length);
    const operators = getAllowedOperators(property);
    const operator = matchOperator(operators, rest);
    if (operator) {
      return { step: 'property', property, operator, value: textAfterOperator(rest, operator) };
    }
    const operatorPrefix = matchOperatorPrefix(operators, rest);
    if (operatorPrefix !== undefined) {
      return { step: 'operator', property, operatorPrefix };
    }
  }
  const operator = matchOperator(freeTextOperators, text);
  if (operator) {
    return { step: 'free-text', operator, value: textAfterOperator(text, operator) };
  }
  return { step: 'free-text', value: text };
}

/**
 * The filter the typed text stands for, or null when it cannot become one: blank text, or text that
 * names no property while free text filtering is turned off.
 */
export function createToken(text: string, parsed: ParsedText, disableFreeTextFiltering: boolean): Token | null {
  if (parsed.step === 'property') {
    return { propertyKey: parsed.property.key, operator: parsed.operator, value: parsed.value.trim() };
  }
  if (disableFreeTextFiltering) {
    return null;
  }
  const operator = parsed.step === 'free-text' && parsed.operator ? parsed.operator : ':';
  const value = (parsed.step === 'free-text' && parsed.operator ? parsed.value : text).trim();
  return value === '' ? null : { operator, value };
}

/**
 * The value as the user should see it: its label from the filtering options, or the value itself.
 */
export function getValueLabel(token: Token, options: ReadonlyArray<FilteringOption>): string {
  const option = options.find(entry => entry.propertyKey === token.propertyKey && entry.value === token.value);
  return option?.label ?? token.value;
}

/**
 * A filter as it is shown and read out. A filter on a property that is not in the list, such as one
 * that has not loaded yet, shows its key.
 */
export function formatToken(
  token: Token,
  properties: ReadonlyArray<FilteringProperty>,
  options: ReadonlyArray<FilteringOption>,
  operatorName: (operator: Operator) => string
): PropertyFilterProps.FormattedToken {
  const property = findProperty(properties, token.propertyKey);
  return {
    propertyLabel: property?.propertyLabel ?? token.propertyKey,
    operator: token.operator,
    operatorText: operatorName(token.operator),
    value: getValueLabel(token, options),
  };
}

/**
 * The value options of one property, without duplicates.
 */
export function getPropertyOptions(
  options: ReadonlyArray<FilteringOption>,
  propertyKey: string
): ReadonlyArray<FilteringOption> {
  const seen = new Set<string>();
  return options.filter(option => {
    if (option.propertyKey !== propertyKey || seen.has(option.value)) {
      return false;
    }
    seen.add(option.value);
    return true;
  });
}

function compareValues(operator: Operator, itemValue: unknown, tokenValue: string): boolean {
  const text = String(itemValue ?? '').toLowerCase();
  const target = tokenValue.toLowerCase();
  switch (operator) {
    case '=':
      return text === target;
    case '!=':
      return text !== target;
    case ':':
      return text.includes(target);
    case '!:':
      return !text.includes(target);
    case '^':
      return text.startsWith(target);
    case '!^':
      return !text.startsWith(target);
  }
  const number = Number(itemValue);
  const targetNumber = Number(tokenValue);
  const numeric = itemValue !== '' && tokenValue.trim() !== '' && !isNaN(number) && !isNaN(targetNumber);
  const order = numeric ? number - targetNumber : text.localeCompare(target);
  switch (operator) {
    case '>':
      return order > 0;
    case '<':
      return order < 0;
    case '>=':
      return order >= 0;
    case '<=':
      return order <= 0;
  }
}

/**
 * Whether an item passes one filter. A free text filter looks at every filtering property: `:` passes
 * when any of them contains the value, `!:` when none does.
 */
export function matchesToken(
  item: Readonly<Record<string, unknown>>,
  token: Token,
  properties: ReadonlyArray<FilteringProperty>
): boolean {
  if (token.propertyKey !== undefined) {
    return compareValues(token.operator, item[token.propertyKey], token.value);
  }
  const anyContains = properties.some(property => compareValues(':', item[property.key], token.value));
  return token.operator === '!:' ? !anyContains : anyContains;
}

/**
 * Whether an item passes a query. A query without filters passes every item.
 */
export function matchesPropertyFilterQuery(
  item: Readonly<Record<string, unknown>>,
  query: PropertyFilterProps.Query,
  properties: ReadonlyArray<FilteringProperty>
): boolean {
  if (query.tokens.length === 0) {
    return true;
  }
  const passes = (token: Token) => matchesToken(item, token, properties);
  return query.operation === 'and' ? query.tokens.every(passes) : query.tokens.some(passes);
}
