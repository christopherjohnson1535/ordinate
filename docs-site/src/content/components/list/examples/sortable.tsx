// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import List from '@ordinate/components/list';
import SpaceBetween from '@ordinate/components/space-between';

interface Region {
  id: string;
  name: string;
  city: string;
}

export default function Sortable() {
  const [regions, setRegions] = useState<Region[]>([
    { id: 'us-mountain-1', name: 'us-mountain-1', city: 'Denver' },
    { id: 'us-coastal-2', name: 'us-coastal-2', city: 'Portland' },
    { id: 'eu-north-1', name: 'eu-north-1', city: 'Stockholm' },
    { id: 'ap-south-1', name: 'ap-south-1', city: 'Mumbai' },
  ]);

  return (
    <SpaceBetween size="s">
      <List
        ariaLabel="Deployment order"
        items={regions}
        sortable={true}
        onSortingChange={event => setRegions(event.detail.items)}
        renderItem={region => ({ id: region.id, content: region.name, secondaryContent: region.city })}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        Deploys to {regions.map(region => region.name).join(', then ')}.
      </Box>
    </SpaceBetween>
  );
}
