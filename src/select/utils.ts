// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SelectProps } from './interfaces';

export interface GroupItem {
  type: 'group';
  option: SelectProps.OptionGroup;
  disabled: boolean;
}

export interface OptionItem {
  type: 'option';
  option: SelectProps.Option;
  group: SelectProps.OptionGroup | null;
  disabled: boolean;
}

export type ListItem = GroupItem | OptionItem;

export function isGroup(option: SelectProps.Option | SelectProps.OptionGroup): option is SelectProps.OptionGroup {
  return 'options' in option && Array.isArray(option.options);
}

export function getLabel(option: SelectProps.Option): string {
  return option.label ?? option.value ?? '';
}

function matches(option: SelectProps.Option, text: string): boolean {
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
export function flattenOptions(options: SelectProps.Options, filteringText = ''): ListItem[] {
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

export function isSameOption(a: SelectProps.Option, b: SelectProps.Option | null): boolean {
  if (!b) {
    return false;
  }
  if (a.value !== undefined || b.value !== undefined) {
    return a.value === b.value;
  }
  return a === b;
}
