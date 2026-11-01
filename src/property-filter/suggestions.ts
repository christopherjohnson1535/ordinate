// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  OptionDefinition,
  OptionGroupDefinition,
  OptionsDefinition,
} from '../internal/components/option-list/interfaces';
import { PropertyFilterProps } from './interfaces';
import {
  findProperty,
  getAllowedOperators,
  getDefaultOperator,
  getPropertyOptions,
  isolateOperator,
  ParsedText,
} from './utils';

type FilteringProperty = PropertyFilterProps.FilteringProperty;
type FilteringOption = PropertyFilterProps.FilteringOption;

/**
 * What choosing a suggestion does: `text` replaces the typed text and keeps the suggestions open for the
 * next step, `token` adds a filter.
 */
export type SuggestionAction = { type: 'text'; text: string } | { type: 'token'; token: PropertyFilterProps.Token };

export interface SuggestionLabels {
  groupPropertiesText: string;
  groupValuesText: string;
  operatorsText: string;
  operatorName(operator: PropertyFilterProps.ComparisonOperator): string;
  groupValuesLabel(property: FilteringProperty): string;
}

export interface Suggestions {
  options: OptionsDefinition;
  /**
   * The action of each suggestion, keyed by the option object in `options`.
   */
  actions: ReadonlyMap<OptionDefinition, SuggestionAction>;
}

function includes(text: string | undefined, search: string): boolean {
  return (text ?? '').toLowerCase().includes(search.trim().toLowerCase());
}

class SuggestionBuilder {
  private readonly groups = new Map<string, OptionDefinition[]>();
  readonly actions = new Map<OptionDefinition, SuggestionAction>();

  add(groupLabel: string, option: OptionDefinition, action: SuggestionAction) {
    const group = this.groups.get(groupLabel) ?? [];
    group.push(option);
    this.groups.set(groupLabel, group);
    this.actions.set(option, action);
  }

  build(): Suggestions {
    const options: OptionGroupDefinition[] = [];
    this.groups.forEach((groupOptions, label) => options.push({ label, options: groupOptions }));
    return { options, actions: this.actions };
  }
}

function addPropertyValues(
  builder: SuggestionBuilder,
  property: FilteringProperty,
  operator: PropertyFilterProps.ComparisonOperator,
  options: ReadonlyArray<FilteringOption>,
  search: string,
  labels: SuggestionLabels
) {
  for (const option of getPropertyOptions(options, property.key)) {
    if (!includes(option.label, search) && !includes(option.value, search)) {
      continue;
    }
    builder.add(
      labels.groupValuesLabel(property),
      { value: `${property.propertyLabel} ${operator} ${option.value}`, label: option.label ?? option.value },
      { type: 'token', token: { propertyKey: property.key, operator, value: option.value } }
    );
  }
}

function addOperators(
  builder: SuggestionBuilder,
  property: FilteringProperty,
  operatorPrefix: string,
  labels: SuggestionLabels
) {
  for (const operator of getAllowedOperators(property)) {
    if (!operator.startsWith(operatorPrefix)) {
      continue;
    }
    const text = `${property.propertyLabel} ${operator}`;
    builder.add(
      labels.operatorsText,
      {
        value: text,
        label: `${property.propertyLabel} ${isolateOperator(operator)}`,
        description: labels.operatorName(operator),
      },
      { type: 'text', text: `${text} ` }
    );
  }
}

// Text that names no property yet suggests the matching properties, and values of every property.
function addPropertiesAndValues(
  builder: SuggestionBuilder,
  properties: ReadonlyArray<FilteringProperty>,
  options: ReadonlyArray<FilteringOption>,
  search: string,
  labels: SuggestionLabels
) {
  for (const property of properties) {
    if (includes(property.propertyLabel, search)) {
      builder.add(
        property.group ?? labels.groupPropertiesText,
        { value: property.propertyLabel, label: property.propertyLabel },
        { type: 'text', text: `${property.propertyLabel} ` }
      );
    }
  }
  const seen = new Set<string>();
  for (const option of options) {
    const property = findProperty(properties, option.propertyKey);
    const key = `${option.propertyKey}\u0000${option.value}`;
    if (!property || seen.has(key)) {
      continue;
    }
    seen.add(key);
    const operator = getDefaultOperator(property);
    const text = `${property.propertyLabel} ${operator} ${option.label ?? option.value}`;
    if (includes(text, search)) {
      builder.add(
        labels.groupValuesText,
        { value: `${property.propertyLabel} ${operator} ${option.value}`, label: text },
        { type: 'token', token: { propertyKey: property.key, operator, value: option.value } }
      );
    }
  }
}

/**
 * The suggestions for the typed text: values once a property and an operator are typed, operators once
 * a property is typed, and otherwise properties and values that contain the text.
 */
export function getSuggestions(
  parsed: ParsedText,
  properties: ReadonlyArray<FilteringProperty>,
  options: ReadonlyArray<FilteringOption>,
  labels: SuggestionLabels
): Suggestions {
  const builder = new SuggestionBuilder();
  switch (parsed.step) {
    case 'property':
      addPropertyValues(builder, parsed.property, parsed.operator, options, parsed.value, labels);
      break;
    case 'operator':
      addOperators(builder, parsed.property, parsed.operatorPrefix, labels);
      break;
    case 'free-text':
      // A free text operator, as in "!: web", leaves nothing to suggest.
      if (!parsed.operator) {
        addPropertiesAndValues(builder, properties, options, parsed.value, labels);
      }
      break;
  }
  return builder.build();
}
