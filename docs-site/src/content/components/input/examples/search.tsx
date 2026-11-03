// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';

const services = ['survey-api', 'survey-worker', 'drawings-store', 'north-annex-web', 'billing-export'];

export default function Search() {
  const [query, setQuery] = useState('survey');
  const matches = services.filter(service => service.includes(query.trim().toLowerCase()));

  return (
    <SpaceBetween size="s">
      <Input
        type="search"
        ariaLabel="Find services"
        clearAriaLabel="Clear the search"
        placeholder="Find services"
        value={query}
        onChange={event => setQuery(event.detail.value)}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {matches.length === 0 ? 'No services match.' : matches.join(', ')}
      </Box>
    </SpaceBetween>
  );
}
