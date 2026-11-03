// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import PropertyFilter, { PropertyFilterProps } from '@ordinate/components/property-filter';

const filteringProperties: PropertyFilterProps.FilteringProperty[] = [
  { key: 'author', propertyLabel: 'Author', operators: ['!='] },
  { key: 'branch', propertyLabel: 'Branch', operators: ['^'] },
];

// Stands in for a server that searches commit authors and branches.
const server: PropertyFilterProps.FilteringOption[] = [
  ...['Dana Ruiz', 'Sam Okafor', 'Lee Park', 'Priya Nair'].map(value => ({ propertyKey: 'author', value })),
  ...['main', 'release/4.2', 'fix/upload-timeout', 'feature/sheet-index'].map(value => ({
    propertyKey: 'branch',
    value,
  })),
];

export default function Async() {
  const [query, setQuery] = useState<PropertyFilterProps.Query>({ operation: 'and', tokens: [] });
  const [options, setOptions] = useState<PropertyFilterProps.FilteringOption[]>([]);
  const [status, setStatus] = useState<PropertyFilterProps.StatusType>('pending');
  const request = useRef(0);

  const loadItems = ({ detail }: { detail: PropertyFilterProps.LoadItemsDetail }) => {
    const id = ++request.current;
    setStatus('loading');
    setTimeout(() => {
      if (id !== request.current) {
        return;
      }
      const text = detail.filteringText.toLowerCase();
      setOptions(
        server.filter(
          option =>
            (!detail.filteringProperty || option.propertyKey === detail.filteringProperty.key) &&
            option.value.toLowerCase().includes(text)
        )
      );
      setStatus('finished');
    }, 600);
  };

  return (
    <PropertyFilter
      query={query}
      onChange={event => setQuery(event.detail)}
      filteringProperties={filteringProperties}
      filteringOptions={options}
      filteringAriaLabel="Find commits"
      filteringPlaceholder="Find commits"
      onLoadItems={loadItems}
      filteringStatusType={status}
      filteringLoadingText="Loading suggestions"
      filteringErrorText="Suggestions could not be loaded."
      filteringRecoveryText="Retry"
    />
  );
}
