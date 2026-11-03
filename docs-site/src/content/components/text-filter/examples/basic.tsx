// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import List from '@ordinate/components/list';
import SpaceBetween from '@ordinate/components/space-between';
import TextFilter from '@ordinate/components/text-filter';

const services = [
  { name: 'north-annex-web', image: 'web:v2' },
  { name: 'gallery-east', image: 'web:v2' },
  { name: 'atrium-api', image: 'api:v7' },
  { name: 'archive-batch', image: 'batch:v3' },
  { name: 'vault-store', image: 'store:v12' },
  { name: 'lobby-cache', image: 'cache:v4' },
  { name: 'reading-room', image: 'web:v2' },
];

export default function Basic() {
  const [filteringText, setFilteringText] = useState('web');
  const text = filteringText.trim().toLowerCase();
  const matches = services.filter(service => service.name.includes(text) || service.image.includes(text));

  return (
    <SpaceBetween size="m">
      <TextFilter
        filteringText={filteringText}
        onChange={event => setFilteringText(event.detail.filteringText)}
        filteringPlaceholder="Find services"
        filteringAriaLabel="Find services by name or image"
        countText={`${matches.length} ${matches.length === 1 ? 'match' : 'matches'}`}
      />
      {matches.length > 0 ? (
        <List
          ariaLabel="Matching services"
          items={matches}
          renderItem={service => ({ id: service.name, content: service.name, secondaryContent: service.image })}
        />
      ) : (
        <Box color="text-body-secondary">No services match “{filteringText}”.</Box>
      )}
    </SpaceBetween>
  );
}
