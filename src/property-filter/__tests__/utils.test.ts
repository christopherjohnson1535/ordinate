// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, test } from 'vitest';

import { PropertyFilterProps } from '../../../lib/components/property-filter';
import { getSuggestions, SuggestionLabels } from '../../../lib/components/property-filter/suggestions';
import {
  createToken,
  formatToken,
  getAllowedOperators,
  matchesPropertyFilterQuery,
  matchOperator,
  matchOperatorPrefix,
  matchProperty,
  parseText,
} from '../../../lib/components/property-filter/utils';

const status: PropertyFilterProps.FilteringProperty = {
  key: 'status',
  propertyLabel: 'Status',
  operators: ['!=', ':'],
};
const instance: PropertyFilterProps.FilteringProperty = { key: 'instance', propertyLabel: 'Instance' };
const instanceType: PropertyFilterProps.FilteringProperty = {
  key: 'type',
  propertyLabel: 'Instance type',
  defaultOperator: ':',
  operators: ['=', '^'],
};
const cpus: PropertyFilterProps.FilteringProperty = {
  key: 'cpus',
  propertyLabel: 'vCPUs',
  operators: ['>', '<', '>=', '<='],
  group: 'Capacity',
};
const properties = [status, instance, instanceType, cpus];

const options: PropertyFilterProps.FilteringOption[] = [
  { propertyKey: 'status', value: 'running', label: 'Running' },
  { propertyKey: 'status', value: 'stopped', label: 'Stopped' },
  { propertyKey: 'status', value: 'running', label: 'Running' },
  { propertyKey: 'type', value: 'large' },
  { propertyKey: 'unknown', value: 'x' },
];

describe('operators', () => {
  test('a property allows its default operator first, without duplicates', () => {
    expect(getAllowedOperators(status)).toEqual(['=', '!=', ':']);
    expect(getAllowedOperators(instanceType)).toEqual([':', '=', '^']);
    expect(getAllowedOperators(undefined)).toEqual([':', '!:']);
  });

  test('matchOperator finds the longest operator after leading spaces', () => {
    expect(matchOperator(['>', '>=', '='], '  >= 4')).toBe('>=');
    expect(matchOperator(['>', '>=', '='], '> 4')).toBe('>');
    expect(matchOperator(['=', '!='], 'x')).toBeUndefined();
  });

  test('matchOperatorPrefix accepts blank text and the start of an operator', () => {
    expect(matchOperatorPrefix(['=', '!='], '  ')).toBe('');
    expect(matchOperatorPrefix(['=', '!='], ' ! ')).toBe('!');
    expect(matchOperatorPrefix(['=', '!='], 'x')).toBeUndefined();
  });
});

describe('matchProperty', () => {
  test('matches the start of the text, ignoring case', () => {
    expect(matchProperty(properties, 'status = running')).toBe(status);
    expect(matchProperty(properties, 'Stat')).toBeUndefined();
  });

  test('prefers the longest label', () => {
    expect(matchProperty(properties, 'Instance type = large')).toBe(instanceType);
    expect(matchProperty(properties, 'Instance = i-1')).toBe(instance);
  });
});

describe('parseText', () => {
  test('reads a property, an operator and a value', () => {
    expect(parseText('Status = run', properties)).toEqual({
      step: 'property',
      property: status,
      operator: '=',
      value: 'run',
    });
    expect(parseText('Status!=stopped', properties)).toEqual({
      step: 'property',
      property: status,
      operator: '!=',
      value: 'stopped',
    });
    expect(parseText('vCPUs >= 4', properties)).toEqual({
      step: 'property',
      property: cpus,
      operator: '>=',
      value: '4',
    });
  });

  test('keeps the spaces inside a value', () => {
    expect(parseText('Status = a b ', properties)).toMatchObject({ value: 'a b ' });
  });

  test('waits for an operator after a property', () => {
    expect(parseText('Status', properties)).toEqual({ step: 'operator', property: status, operatorPrefix: '' });
    expect(parseText('Status !', properties)).toEqual({ step: 'operator', property: status, operatorPrefix: '!' });
  });

  test('ignores operators the property does not allow', () => {
    expect(parseText('Status ^ r', properties)).toEqual({ step: 'free-text', value: 'Status ^ r' });
  });

  test('treats anything else as free text, with an optional free text operator', () => {
    expect(parseText('web', properties)).toEqual({ step: 'free-text', value: 'web' });
    expect(parseText('Statuses', properties)).toEqual({ step: 'free-text', value: 'Statuses' });
    expect(parseText('!: web', properties)).toEqual({ step: 'free-text', operator: '!:', value: 'web' });
  });
});

describe('createToken', () => {
  const create = (text: string, disableFreeText = false) =>
    createToken(text, parseText(text, properties), disableFreeText);

  test('creates a property filter with a trimmed value', () => {
    expect(create('Status = running ')).toEqual({ propertyKey: 'status', operator: '=', value: 'running' });
    expect(create('Status =')).toEqual({ propertyKey: 'status', operator: '=', value: '' });
  });

  test('creates a free text filter that contains the text', () => {
    expect(create(' web ')).toEqual({ operator: ':', value: 'web' });
    expect(create('Status')).toEqual({ operator: ':', value: 'Status' });
    expect(create('!: web')).toEqual({ operator: '!:', value: 'web' });
  });

  test('creates nothing for blank text or free text when it is turned off', () => {
    expect(create('   ')).toBeNull();
    expect(create('!: ')).toBeNull();
    expect(create('web', true)).toBeNull();
    expect(create('Status = on', true)).toEqual({ propertyKey: 'status', operator: '=', value: 'on' });
  });
});

describe('formatToken', () => {
  const name = (operator: string) => `<${operator}>`;

  test('uses the property label and the value label', () => {
    expect(formatToken({ propertyKey: 'status', operator: '=', value: 'running' }, properties, options, name)).toEqual({
      propertyLabel: 'Status',
      operator: '=',
      operatorText: '<=>',
      value: 'Running',
    });
  });

  test('shows the key of an unknown property and no property for free text', () => {
    expect(formatToken({ propertyKey: 'zone', operator: '=', value: 'a' }, properties, options, name)).toMatchObject({
      propertyLabel: 'zone',
      value: 'a',
    });
    expect(formatToken({ operator: ':', value: 'web' }, properties, options, name).propertyLabel).toBeUndefined();
  });
});

describe('getSuggestions', () => {
  const labels: SuggestionLabels = {
    groupPropertiesText: 'Properties',
    groupValuesText: 'Values',
    operatorsText: 'Operators',
    operatorName: operator => `name ${operator}`,
    groupValuesLabel: property => `${property.propertyLabel} values`,
  };
  const suggest = (text: string) => getSuggestions(parseText(text, properties), properties, options, labels);
  const summarize = (text: string) => {
    const { options: groups, actions } = suggest(text);
    return groups.map(group => ({
      label: group.label,
      options: 'options' in group ? group.options.map(option => [option.label, actions.get(option)]) : [],
    }));
  };

  test('suggests matching properties, grouped, and matching values of every property', () => {
    expect(summarize('run')).toEqual([
      {
        label: 'Values',
        options: [
          ['Status = Running', { type: 'token', token: { propertyKey: 'status', operator: '=', value: 'running' } }],
        ],
      },
    ]);
    expect(summarize('c').map(group => group.label)).toEqual(['Properties', 'Capacity', 'Values']);
    expect(summarize('vc')[0].options).toEqual([['vCPUs', { type: 'text', text: 'vCPUs ' }]]);
  });

  test('uses the property default operator for values', () => {
    expect(summarize('large')[0].options[0]).toEqual([
      'Instance type : large',
      { type: 'token', token: { propertyKey: 'type', operator: ':', value: 'large' } },
    ]);
  });

  test('suggests the operators of a typed property', () => {
    const groups = summarize('Status !');
    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe('Operators');
    expect(groups[0].options).toEqual([['Status ⁦!=⁩', { type: 'text', text: 'Status != ' }]]);
    expect(suggest('Status').options[0]).toMatchObject({ options: [{ description: 'name =' }, {}, {}] });
  });

  test('suggests the values of a typed property, without duplicates', () => {
    const groups = summarize('Status != ');
    expect(groups).toEqual([
      {
        label: 'Status values',
        options: [
          ['Running', { type: 'token', token: { propertyKey: 'status', operator: '!=', value: 'running' } }],
          ['Stopped', { type: 'token', token: { propertyKey: 'status', operator: '!=', value: 'stopped' } }],
        ],
      },
    ]);
    expect(summarize('Status = sto')[0].options.map(([label]) => label)).toEqual(['Stopped']);
  });

  test('suggests nothing after a free text operator', () => {
    expect(suggest('!: web').options).toEqual([]);
  });
});

describe('matchesPropertyFilterQuery', () => {
  const items = [
    { status: 'running', instance: 'web-1', cpus: 4, type: 'large' },
    { status: 'stopped', instance: 'db-1', cpus: 16, type: 'xlarge' },
    { status: 'Running', instance: 'web-2', cpus: 2, type: 'small' },
  ];
  const filter = (tokens: PropertyFilterProps.Token[], operation: PropertyFilterProps.Operation = 'and') =>
    items
      .filter(item => matchesPropertyFilterQuery(item, { tokens, operation }, properties))
      .map(item => item.instance);

  test('passes every item without filters', () => {
    expect(filter([])).toEqual(['web-1', 'db-1', 'web-2']);
  });

  test('compares text without case', () => {
    expect(filter([{ propertyKey: 'status', operator: '=', value: 'running' }])).toEqual(['web-1', 'web-2']);
    expect(filter([{ propertyKey: 'status', operator: '!=', value: 'RUNNING' }])).toEqual(['db-1']);
    expect(filter([{ propertyKey: 'type', operator: ':', value: 'larg' }])).toEqual(['web-1', 'db-1']);
    expect(filter([{ propertyKey: 'type', operator: '!:', value: 'larg' }])).toEqual(['web-2']);
    expect(filter([{ propertyKey: 'instance', operator: '^', value: 'web' }])).toEqual(['web-1', 'web-2']);
    expect(filter([{ propertyKey: 'instance', operator: '!^', value: 'web' }])).toEqual(['db-1']);
  });

  test('compares numbers as numbers', () => {
    expect(filter([{ propertyKey: 'cpus', operator: '>', value: '4' }])).toEqual(['db-1']);
    expect(filter([{ propertyKey: 'cpus', operator: '>=', value: '4' }])).toEqual(['web-1', 'db-1']);
    expect(filter([{ propertyKey: 'cpus', operator: '<', value: '4' }])).toEqual(['web-2']);
    expect(filter([{ propertyKey: 'cpus', operator: '<=', value: '4' }])).toEqual(['web-1', 'web-2']);
  });

  test('matches free text against every property', () => {
    expect(filter([{ operator: ':', value: 'db' }])).toEqual(['db-1']);
    expect(filter([{ operator: '!:', value: 'web' }])).toEqual(['db-1']);
  });

  test('combines filters with and or with or', () => {
    const tokens: PropertyFilterProps.Token[] = [
      { propertyKey: 'status', operator: '=', value: 'running' },
      { propertyKey: 'cpus', operator: '>', value: '8' },
    ];
    expect(filter(tokens, 'and')).toEqual([]);
    expect(filter(tokens, 'or')).toEqual(['web-1', 'db-1', 'web-2']);
  });
});
