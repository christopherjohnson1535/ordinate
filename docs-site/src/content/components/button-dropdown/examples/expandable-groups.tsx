// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import ButtonDropdown from '@ordinate/components/button-dropdown';
import SpaceBetween from '@ordinate/components/space-between';

export default function ExpandableGroups() {
  const [last, setLast] = useState('Nothing chosen yet.');

  return (
    <SpaceBetween size="m" alignItems="center">
      <ButtonDropdown
        expandableGroups={true}
        items={[
          {
            id: 'compute',
            text: 'Compute',
            iconName: 'screens',
            items: [
              { id: 'node', text: 'Node' },
              { id: 'node-pool', text: 'Node pool' },
            ],
          },
          {
            id: 'storage',
            text: 'Storage',
            iconName: 'folder',
            items: [
              { id: 'volume', text: 'Volume' },
              { id: 'bucket', text: 'Bucket' },
              { id: 'snapshot', text: 'Snapshot' },
            ],
          },
          {
            id: 'network',
            text: 'Network',
            iconName: 'globe',
            disabled: true,
            items: [{ id: 'gateway', text: 'Gateway' }],
          },
        ]}
        onItemClick={event => setLast(`Creating a ${event.detail.id}.`)}
      >
        Create resource
      </ButtonDropdown>
      <Box color="text-body-secondary" fontSize="body-s">
        {last}
      </Box>
    </SpaceBetween>
  );
}
