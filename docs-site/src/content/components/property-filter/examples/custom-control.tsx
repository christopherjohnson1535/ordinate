// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ButtonDropdown from '@ordinate/components/button-dropdown';
import PropertyFilter, { PropertyFilterProps } from '@ordinate/components/property-filter';
import Select, { SelectProps } from '@ordinate/components/select';

const filteringProperties: PropertyFilterProps.FilteringProperty[] = [
  { key: 'status', propertyLabel: 'Status', operators: ['!='] },
  { key: 'owner', propertyLabel: 'Owner', operators: ['!='] },
];

const filteringOptions: PropertyFilterProps.FilteringOption[] = [
  ...['Open', 'In review', 'Closed'].map(value => ({ propertyKey: 'status', value })),
  ...['Dana Ruiz', 'Sam Okafor'].map(value => ({ propertyKey: 'owner', value })),
];

const savedSets: Record<string, PropertyFilterProps.Query> = {
  mine: {
    operation: 'and',
    tokens: [
      { propertyKey: 'owner', operator: '=', value: 'Dana Ruiz' },
      { propertyKey: 'status', operator: '!=', value: 'Closed' },
    ],
  },
  review: { operation: 'and', tokens: [{ propertyKey: 'status', operator: '=', value: 'In review' }] },
};

const savedOptions: SelectProps.Option[] = [
  { value: 'mine', label: 'My open requests' },
  { value: 'review', label: 'Waiting for review' },
];

export default function CustomControl() {
  const [saved, setSaved] = useState<SelectProps.Option | null>(savedOptions[0]);
  const [query, setQuery] = useState(savedSets.mine);

  return (
    <PropertyFilter
      query={query}
      onChange={event => {
        setQuery(event.detail);
        setSaved(null);
      }}
      filteringProperties={filteringProperties}
      filteringOptions={filteringOptions}
      filteringAriaLabel="Find change requests"
      filteringPlaceholder="Find change requests"
      expandToViewport={true}
      customControl={
        <Select
          ariaLabel="Saved filter sets"
          placeholder="Choose a filter set"
          options={savedOptions}
          selectedOption={saved}
          onChange={event => {
            setSaved(event.detail.selectedOption);
            setQuery(savedSets[event.detail.selectedOption.value!]);
          }}
        />
      }
      customFilterActions={
        <ButtonDropdown
          expandToViewport={true}
          items={[
            { id: 'clear', text: 'Clear filters' },
            { id: 'save', text: 'Save as a new set' },
          ]}
          onItemClick={event => {
            if (event.detail.id === 'clear') {
              setQuery({ operation: 'and', tokens: [] });
              setSaved(null);
            }
          }}
        >
          Filter actions
        </ButtonDropdown>
      }
    />
  );
}
