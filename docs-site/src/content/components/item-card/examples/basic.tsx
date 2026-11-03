// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import ButtonDropdown from '@ordinate/components/button-dropdown';
import ItemCard from '@ordinate/components/item-card';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import Link from '@ordinate/components/link';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';

export default function Basic() {
  const [lastAction, setLastAction] = useState('No action taken yet.');

  return (
    <SpaceBetween size="m">
      <Box>
        <ItemCard
          header={<Link href="#/components/item-card">atrium-api</Link>}
          description="api:v7 on 6 nodes in us-mountain-1"
          reference="R3"
          kind="resource"
          actions={
            <ButtonDropdown
              variant="icon"
              ariaLabel="Actions for atrium-api"
              items={[
                { id: 'restart', text: 'Restart' },
                { id: 'logs', text: 'Open logs' },
                { id: 'scale', text: 'Change node count' },
              ]}
              onItemClick={event => setLastAction(`Chose "${event.detail.id}" for atrium-api.`)}
            />
          }
          footer="Deployed 2 hours ago by Dana Ruiz"
        >
          <KeyValuePairs
            columns={2}
            items={[
              { label: 'Status', value: <StatusIndicator state="complete">Running</StatusIndicator> },
              { label: 'Nodes', value: '6 of 8' },
            ]}
          />
        </ItemCard>
      </Box>
      <Box color="text-body-secondary" fontSize="body-s">
        {lastAction}
      </Box>
    </SpaceBetween>
  );
}
