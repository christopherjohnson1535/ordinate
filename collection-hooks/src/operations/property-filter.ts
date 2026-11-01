// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  FilteringOption,
  FilteringProperty,
  PropertyFilterOperator,
  PropertyFilterQuery,
  PropertyFilterToken,
} from '../interfaces';
import { getField, isPrimitive, toNumber, toSearchText } from './values';

type Matcher = (itemValue: unknown, tokenValue: unknown) => boolean;

function isMissing(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

function equals(itemValue: unknown, tokenValue: unknown): boolean {
  if (isMissing(itemValue) || isMissing(tokenValue)) {
    return isMissing(itemValue) && isMissing(tokenValue);
  }
  const tokenNumber = toNumber(tokenValue);
  if (typeof itemValue === 'number' && tokenNumber !== null) {
    return itemValue === tokenNumber;
  }
  return isPrimitive(itemValue) && isPrimitive(tokenValue) && String(itemValue) === String(tokenValue);
}

/**
 * Orders an item value against a token value: numerically when the item holds a number and the token
 * reads as one, otherwise as text. Returns `null` when the two cannot be ordered.
 */
function compare(itemValue: unknown, tokenValue: unknown): number | null {
  if (isMissing(itemValue) || isMissing(tokenValue) || !isPrimitive(itemValue) || !isPrimitive(tokenValue)) {
    return null;
  }
  const tokenNumber = toNumber(tokenValue);
  if (typeof itemValue === 'number' && tokenNumber !== null) {
    return itemValue - tokenNumber;
  }
  return String(itemValue).localeCompare(String(tokenValue), undefined, { numeric: true });
}

function ordered(test: (difference: number) => boolean): Matcher {
  return (itemValue, tokenValue) => {
    const difference = compare(itemValue, tokenValue);
    return difference !== null && test(difference);
  };
}

const contains: Matcher = (itemValue, tokenValue) => toSearchText(itemValue).includes(toSearchText(tokenValue));
const startsWith: Matcher = (itemValue, tokenValue) => toSearchText(itemValue).startsWith(toSearchText(tokenValue));

const positiveMatchers: Record<PropertyFilterOperator, Matcher> = {
  '=': equals,
  '!=': (itemValue, tokenValue) => !equals(itemValue, tokenValue),
  ':': contains,
  '!:': (itemValue, tokenValue) => !contains(itemValue, tokenValue),
  '^': startsWith,
  '!^': (itemValue, tokenValue) => !startsWith(itemValue, tokenValue),
  '>': ordered(difference => difference > 0),
  '<': ordered(difference => difference < 0),
  '>=': ordered(difference => difference >= 0),
  '<=': ordered(difference => difference <= 0),
};

export function isNegated(operator: PropertyFilterOperator): boolean {
  return operator.startsWith('!');
}

/**
 * The built-in matcher for an operator. A list value matches a positive operator when any of its
 * entries does, and a negated operator only when all of them do.
 */
export function getBuiltInMatcher(operator: PropertyFilterOperator): Matcher {
  const match = positiveMatchers[operator];
  return (itemValue, tokenValue) => {
    if (!Array.isArray(itemValue)) {
      return match(itemValue, tokenValue);
    }
    return isNegated(operator)
      ? itemValue.every(entry => match(entry, tokenValue))
      : itemValue.some(entry => match(entry, tokenValue));
  };
}

/**
 * The matcher a property uses for an operator, or `null` when the property does not support it.
 */
export function resolveMatcher(property: FilteringProperty, operator: PropertyFilterOperator): Matcher | null {
  for (const entry of property.operators ?? []) {
    if (typeof entry === 'string' && entry === operator) {
      return getBuiltInMatcher(operator);
    }
    if (typeof entry === 'object' && entry.operator === operator) {
      return entry.match ?? getBuiltInMatcher(operator);
    }
  }
  return operator === (property.defaultOperator ?? '=') ? getBuiltInMatcher(operator) : null;
}

function matchesFreeText<T>(item: T, token: PropertyFilterToken, properties: ReadonlyArray<FilteringProperty>) {
  const match = getBuiltInMatcher(token.operator);
  const test = (property: FilteringProperty) => match(getField(item, property.key), token.value);
  return isNegated(token.operator) ? properties.every(test) : properties.some(test);
}

export function matchesToken<T>(
  item: T,
  token: PropertyFilterToken,
  properties: ReadonlyArray<FilteringProperty>
): boolean {
  if (token.propertyKey === undefined) {
    return matchesFreeText(item, token, properties);
  }
  const property = properties.find(candidate => candidate.key === token.propertyKey);
  if (!property) {
    return false;
  }
  const match = resolveMatcher(property, token.operator);
  return match ? match(getField(item, property.key), token.value) : false;
}

export function matchesQuery<T>(
  item: T,
  query: PropertyFilterQuery,
  properties: ReadonlyArray<FilteringProperty>
): boolean {
  if (query.tokens.length === 0) {
    return true;
  }
  const test = (token: PropertyFilterToken) => matchesToken(item, token, properties);
  return query.operation === 'or' ? query.tokens.some(test) : query.tokens.every(test);
}

export function filterByQuery<T>(
  items: ReadonlyArray<T>,
  query: PropertyFilterQuery,
  properties: ReadonlyArray<FilteringProperty>,
  filteringFunction: (item: T, query: PropertyFilterQuery) => boolean = (item, current) =>
    matchesQuery(item, current, properties)
): ReadonlyArray<T> {
  return items.filter(item => filteringFunction(item, query));
}

/**
 * The distinct values of each filtering property across the items, in the order they first appear,
 * for the property filter to suggest.
 */
export function getFilteringOptions<T>(
  items: ReadonlyArray<T>,
  properties: ReadonlyArray<FilteringProperty>
): ReadonlyArray<FilteringOption> {
  const options: FilteringOption[] = [];
  for (const property of properties) {
    const seen = new Set<string>();
    for (const item of items) {
      const field = getField(item, property.key);
      for (const value of Array.isArray(field) ? field : [field]) {
        if (!isPrimitive(value) || value === '') {
          continue;
        }
        const text = String(value);
        if (!seen.has(text)) {
          seen.add(text);
          options.push({ propertyKey: property.key, value: text });
        }
      }
    }
  }
  return options;
}
