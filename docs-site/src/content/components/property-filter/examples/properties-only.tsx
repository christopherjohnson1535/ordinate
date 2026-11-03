// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import PropertyFilter, { PropertyFilterProps } from '@ordinate/components/property-filter';

const filteringProperties: PropertyFilterProps.FilteringProperty[] = [
  { key: 'region', propertyLabel: 'Region', operators: ['!='] },
  { key: 'tier', propertyLabel: 'Support tier', operators: ['!='] },
  { key: 'seats', propertyLabel: 'Seats', operators: ['>', '<'] },
];

const filteringOptions: PropertyFilterProps.FilteringOption[] = [
  ...['us-mountain-1', 'us-coastal-2', 'eu-north-1'].map(value => ({ propertyKey: 'region', value })),
  ...['Basic', 'Business', 'Enterprise'].map(value => ({ propertyKey: 'tier', value })),
];

export default function PropertiesOnly() {
  const [query, setQuery] = useState<PropertyFilterProps.Query>({
    operation: 'and',
    tokens: [
      { propertyKey: 'tier', operator: '=', value: 'Enterprise' },
      { propertyKey: 'region', operator: '!=', value: 'eu-north-1' },
    ],
  });

  return (
    <PropertyFilter
      query={query}
      onChange={event => setQuery(event.detail)}
      filteringProperties={filteringProperties}
      filteringOptions={filteringOptions}
      filteringAriaLabel="Filter accounts"
      filteringPlaceholder="Filter accounts by property"
      disableFreeTextFiltering={true}
      hideOperations={true}
      expandToViewport={true}
    />
  );
}
