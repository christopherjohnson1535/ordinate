// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import PropertyFilter, { PropertyFilterProps } from '@ordinate/components/property-filter';
import SpaceBetween from '@ordinate/components/space-between';

const filteringProperties: PropertyFilterProps.FilteringProperty[] = [
  { key: 'severity', propertyLabel: 'Severity', operators: ['!='] },
  { key: 'service', propertyLabel: 'Service', operators: ['!=', '^'] },
  { key: 'owner', propertyLabel: 'Owner', operators: ['!='] },
];

// Values are stored as short codes and shown by their labels.
const filteringOptions: PropertyFilterProps.FilteringOption[] = [
  { propertyKey: 'severity', value: 'sev1', label: 'Critical' },
  { propertyKey: 'severity', value: 'sev2', label: 'Major' },
  { propertyKey: 'severity', value: 'sev3', label: 'Minor' },
  ...['north-annex-web', 'atrium-api', 'vault-store'].map(value => ({ propertyKey: 'service', value })),
  ...['Dana Ruiz', 'Sam Okafor', 'Lee Park'].map(value => ({ propertyKey: 'owner', value })),
];

export default function OperationAndLimit() {
  const [query, setQuery] = useState<PropertyFilterProps.Query>({
    operation: 'or',
    tokens: [
      { propertyKey: 'severity', operator: '=', value: 'sev1' },
      { propertyKey: 'owner', operator: '=', value: 'Dana Ruiz' },
      { propertyKey: 'service', operator: '^', value: 'atrium' },
      { operator: ':', value: 'timeout' },
      { propertyKey: 'service', operator: '!=', value: 'vault-store' },
    ],
  });

  return (
    <SpaceBetween size="m">
      <PropertyFilter
        query={query}
        onChange={event => setQuery(event.detail)}
        filteringProperties={filteringProperties}
        filteringOptions={filteringOptions}
        filteringAriaLabel="Find incidents"
        filteringPlaceholder="Find incidents"
        tokenLimit={3}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        Query: {query.tokens.length} filters joined with “{query.operation}”.
      </Box>
    </SpaceBetween>
  );
}
