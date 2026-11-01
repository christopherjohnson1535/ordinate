// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test } from 'vitest';

import { FilteringProperty, PropertyFilterOperator, PropertyFilterQuery } from '../interfaces';
import {
  filterByQuery,
  getBuiltInMatcher,
  getFilteringOptions,
  matchesQuery,
  matchesToken,
  resolveMatcher,
} from '../operations/property-filter';

const allOperators: PropertyFilterOperator[] = ['=', '!=', ':', '!:', '>', '<', '>=', '<=', '^', '!^'];

const properties: FilteringProperty[] = [
  { key: 'name', propertyLabel: 'Name', groupValuesLabel: 'Names', operators: allOperators },
  { key: 'zone', propertyLabel: 'Zone', groupValuesLabel: 'Zones', operators: ['=', '!=', ':', '^'] },
  { key: 'cpu', propertyLabel: 'CPU', groupValuesLabel: 'CPU values', operators: ['=', '>', '<', '>=', '<='] },
  { key: 'tags', propertyLabel: 'Tags', groupValuesLabel: 'Tags', operators: ['=', '!=', ':', '!:'] },
  { key: 'status', propertyLabel: 'Status', groupValuesLabel: 'Statuses' },
];

const items = [
  { name: 'North annex', zone: 'us-mountain-1a', cpu: 42, tags: ['prod', 'core'], status: 'running' },
  { name: 'South annex', zone: 'us-coast-2b', cpu: 7, tags: ['dev'], status: 'stopped' },
  { name: 'Archive', zone: 'eu-north-1a', cpu: 88, tags: [], status: 'running' },
  { name: 'Spare', zone: undefined, cpu: null, tags: ['prod'], status: 'pending' },
];

function names(query: PropertyFilterQuery) {
  return filterByQuery(items, query, properties).map(item => item.name);
}

function token(propertyKey: string | undefined, operator: PropertyFilterOperator, value: unknown) {
  return { propertyKey, operator, value };
}

describe('built-in operators', () => {
  test.each<[PropertyFilterOperator, unknown, unknown, boolean]>([
    ['=', 'running', 'running', true],
    ['=', 'running', 'Running', false],
    ['=', 42, '42', true],
    ['=', 42, '42.0', true],
    ['=', '42', 42, true],
    ['=', undefined, '', true],
    ['=', undefined, 'x', false],
    ['=', true, 'true', true],
    ['=', { a: 1 }, '[object Object]', false],
    ['!=', 'running', 'stopped', true],
    ['!=', 'running', 'running', false],
    [':', 'North annex', 'ANNEX', true],
    [':', 'North annex', 'south', false],
    [':', undefined, 'x', false],
    ['!:', 'North annex', 'south', true],
    ['!:', 'North annex', 'north', false],
    ['^', 'us-mountain-1a', 'US-', true],
    ['^', 'us-mountain-1a', 'mountain', false],
    ['!^', 'us-mountain-1a', 'eu-', true],
    ['!^', 'us-mountain-1a', 'us', false],
    ['>', 42, '7', true],
    ['>', 42, '42', false],
    ['>=', 42, '42', true],
    ['<', 7, '42', true],
    ['<', 42, '7', false],
    ['<=', 7, '7', true],
    ['>', 'item 10', 'item 9', true],
    ['<', 'apple', 'banana', true],
    ['>', null, '1', false],
    ['<', 5, '', false],
    ['>', { a: 1 }, '1', false],
  ])('%s matches %j against %j: %s', (operator, itemValue, tokenValue, expected) => {
    expect(getBuiltInMatcher(operator)(itemValue, tokenValue)).toBe(expected);
  });

  test('a list matches a positive operator when any entry matches', () => {
    expect(getBuiltInMatcher('=')(['prod', 'core'], 'core')).toBe(true);
    expect(getBuiltInMatcher(':')(['prod', 'core'], 'ro')).toBe(true);
    expect(getBuiltInMatcher('=')(['prod'], 'dev')).toBe(false);
    expect(getBuiltInMatcher('=')([], 'dev')).toBe(false);
  });

  test('a list matches a negated operator only when every entry does', () => {
    expect(getBuiltInMatcher('!=')(['prod', 'core'], 'dev')).toBe(true);
    expect(getBuiltInMatcher('!=')(['prod', 'core'], 'core')).toBe(false);
    expect(getBuiltInMatcher('!:')([], 'dev')).toBe(true);
  });
});

describe('resolveMatcher', () => {
  test('supports the listed operators and the default operator', () => {
    expect(resolveMatcher(properties[2], '>')).not.toBeNull();
    expect(resolveMatcher(properties[2], ':')).toBeNull();
    expect(resolveMatcher(properties[4], '=')).not.toBeNull();
    expect(resolveMatcher(properties[4], '!=')).toBeNull();
  });

  test('uses the property default operator', () => {
    const property: FilteringProperty = {
      key: 'name',
      propertyLabel: 'Name',
      groupValuesLabel: '',
      defaultOperator: ':',
    };
    expect(resolveMatcher(property, ':')).not.toBeNull();
    expect(resolveMatcher(property, '=')).toBeNull();
  });

  test('uses the match function of an extended operator', () => {
    const property: FilteringProperty = {
      key: 'cpu',
      propertyLabel: 'CPU',
      groupValuesLabel: '',
      operators: [{ operator: '>', match: (itemValue, tokenValue) => Number(itemValue) > Number(tokenValue) * 10 }],
    };
    const match = resolveMatcher(property, '>')!;
    expect(match(42, '3')).toBe(true);
    expect(match(42, '5')).toBe(false);
  });

  test('an extended operator without a match function uses the built-in one', () => {
    const property: FilteringProperty = {
      key: 'cpu',
      propertyLabel: 'CPU',
      groupValuesLabel: '',
      operators: [{ operator: '<' }],
    };
    expect(resolveMatcher(property, '<')!(7, '8')).toBe(true);
  });
});

describe('matchesToken', () => {
  test('a property token reads that property', () => {
    expect(matchesToken(items[0], token('zone', '^', 'us-'), properties)).toBe(true);
    expect(matchesToken(items[2], token('zone', '^', 'us-'), properties)).toBe(false);
  });

  test('an unknown property or unsupported operator matches nothing', () => {
    expect(matchesToken(items[0], token('owner', '=', 'me'), properties)).toBe(false);
    expect(matchesToken(items[0], token('cpu', ':', '4'), properties)).toBe(false);
  });

  test('free text matches when any property contains it', () => {
    expect(matchesToken(items[0], token(undefined, ':', 'mountain'), properties)).toBe(true);
    expect(matchesToken(items[0], token(undefined, ':', 'core'), properties)).toBe(true);
    expect(matchesToken(items[0], token(undefined, ':', 'coast'), properties)).toBe(false);
  });

  test('negated free text matches when no property contains it', () => {
    expect(matchesToken(items[0], token(undefined, '!:', 'coast'), properties)).toBe(true);
    expect(matchesToken(items[0], token(undefined, '!:', 'annex'), properties)).toBe(false);
  });
});

describe('matchesQuery and filterByQuery', () => {
  test('an empty query matches every item', () => {
    expect(names({ tokens: [], operation: 'and' })).toHaveLength(items.length);
    expect(matchesQuery(items[0], { tokens: [], operation: 'or' }, properties)).toBe(true);
  });

  test('and requires every token', () => {
    expect(
      names({
        operation: 'and',
        tokens: [token('status', '=', 'running'), token('cpu', '>', '50')],
      })
    ).toEqual(['Archive']);
  });

  test('or requires any token', () => {
    expect(
      names({
        operation: 'or',
        tokens: [token('status', '=', 'stopped'), token('cpu', '>', '50')],
      })
    ).toEqual(['South annex', 'Archive']);
  });

  test('combines property, list and free text tokens', () => {
    expect(
      names({
        operation: 'and',
        tokens: [token('tags', '=', 'prod'), token(undefined, '!:', 'spare')],
      })
    ).toEqual(['North annex']);
  });

  test('items missing a value never pass a comparison', () => {
    expect(names({ operation: 'and', tokens: [token('cpu', '<', '50')] })).toEqual(['North annex', 'South annex']);
  });

  test('a custom filtering function replaces token matching', () => {
    const query: PropertyFilterQuery = { operation: 'and', tokens: [token('status', '=', 'running')] };
    const result = filterByQuery(items, query, properties, (item, current) => {
      expect(current).toBe(query);
      return item.cpu === 7;
    });
    expect(result.map(item => item.name)).toEqual(['South annex']);
  });
});

describe('getFilteringOptions', () => {
  test('lists the distinct primitive values of each property in order of appearance', () => {
    const options = getFilteringOptions(items, properties);
    expect(options.filter(option => option.propertyKey === 'status').map(option => option.value)).toEqual([
      'running',
      'stopped',
      'pending',
    ]);
    expect(options.filter(option => option.propertyKey === 'cpu').map(option => option.value)).toEqual([
      '42',
      '7',
      '88',
    ]);
  });

  test('expands lists and skips missing values', () => {
    const options = getFilteringOptions(items, properties);
    expect(options.filter(option => option.propertyKey === 'tags').map(option => option.value)).toEqual([
      'prod',
      'core',
      'dev',
    ]);
    expect(options.filter(option => option.propertyKey === 'zone')).toHaveLength(3);
  });

  test('returns nothing without properties', () => {
    expect(getFilteringOptions(items, [])).toEqual([]);
  });
});
