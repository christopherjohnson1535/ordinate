// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import FormField from '@ordinate-ui/components/form-field';
import Multiselect, { MultiselectProps } from '@ordinate-ui/components/multiselect';

export interface FilterItem {
  id: string;
  title: string;
}

export interface SeriesFilterProps {
  items: ReadonlyArray<FilterItem>;
  selectedIds: ReadonlyArray<string>;
  onChange: (selectedIds: string[]) => void;
  label: string;
  placeholder: string;
  selectedAriaLabel: string;
  className?: string;
}

/**
 * The multiselect above a chart that chooses which series or segments are drawn.
 */
export function SeriesFilter({
  items,
  selectedIds,
  onChange,
  label,
  placeholder,
  selectedAriaLabel,
  className,
}: SeriesFilterProps) {
  const options: MultiselectProps.Option[] = items.map(item => ({ value: item.id, label: item.title }));
  const selected = new Set(selectedIds);
  return (
    <div className={className}>
      <FormField label={label}>
        <Multiselect
          options={options}
          selectedOptions={options.filter(option => selected.has(option.value as string))}
          onChange={event => onChange(event.detail.selectedOptions.map(option => option.value as string))}
          placeholder={placeholder}
          enableSelectAll={items.length > 2}
          hideTokens={true}
          deselectAriaLabel={option => `${selectedAriaLabel} ${option.label ?? option.value}`}
        />
      </FormField>
    </div>
  );
}
