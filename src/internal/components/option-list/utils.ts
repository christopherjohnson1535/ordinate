// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { OptionDefinition, OptionGroupDefinition, OptionsDefinition } from './interfaces';

export interface GroupItem {
  type: 'group';
  option: OptionGroupDefinition;
  disabled: boolean;
}

export interface OptionItem {
  type: 'option';
  option: OptionDefinition;
  group: OptionGroupDefinition | null;
  disabled: boolean;
  /**
   * A row the host adds that is not one of the options, such as "Select all". It is set off from the options by a rule.
   */
  extra?: boolean;
}

export type ListItem = GroupItem | OptionItem;

export function isGroup(option: OptionDefinition | OptionGroupDefinition): option is OptionGroupDefinition {
  return 'options' in option && Array.isArray(option.options);
}

export function getLabel(option: OptionDefinition): string {
  return option.label ?? option.value ?? '';
}

function matches(option: OptionDefinition, text: string): boolean {
  const searchable = [
    option.label,
    option.value,
    option.description,
    option.labelTag,
    ...(option.tags ?? []),
    ...(option.filteringTags ?? []),
  ];
  return searchable.some(value => value?.toLowerCase().includes(text));
}

/**
 * Flattens options and groups into the rows of the list. With `filteringText`,
 * an option is kept when it or its group matches.
 */
export function flattenOptions(options: OptionsDefinition, filteringText = ''): ListItem[] {
  const text = filteringText.trim().toLowerCase();
  const items: ListItem[] = [];
  for (const entry of options) {
    if (isGroup(entry)) {
      const groupDisabled = Boolean(entry.disabled);
      const groupMatches = text === '' || matches(entry, text);
      const children = entry.options.filter(option => groupMatches || matches(option, text));
      if (children.length === 0) {
        continue;
      }
      items.push({ type: 'group', option: entry, disabled: groupDisabled });
      for (const option of children) {
        items.push({ type: 'option', option, group: entry, disabled: groupDisabled || Boolean(option.disabled) });
      }
    } else if (text === '' || matches(entry, text)) {
      items.push({ type: 'option', option: entry, group: null, disabled: Boolean(entry.disabled) });
    }
  }
  return items;
}

export function getOptionItems(items: ReadonlyArray<ListItem>): OptionItem[] {
  return items.filter((item): item is OptionItem => item.type === 'option');
}

export function isSameOption(a: OptionDefinition, b: OptionDefinition | null | undefined): boolean {
  if (!b) {
    return false;
  }
  if (a.value !== undefined || b.value !== undefined) {
    return a.value === b.value;
  }
  return a === b;
}

/**
 * Returns the index of the first option from `start` in the direction of `step` that can be chosen, or -1.
 */
export function findEnabled(options: ReadonlyArray<OptionItem>, start: number, step: 1 | -1): number {
  for (let index = start; index >= 0 && index < options.length; index += step) {
    if (!options[index].disabled) {
      return index;
    }
  }
  return -1;
}
