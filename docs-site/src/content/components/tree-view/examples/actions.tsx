// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '@ordinate/components/badge';
import Box from '@ordinate/components/box';
import ButtonDropdown from '@ordinate/components/button-dropdown';
import SpaceBetween from '@ordinate/components/space-between';
import TreeView from '@ordinate/components/tree-view';

interface Equipment {
  id: string;
  name: string;
  alarm?: boolean;
  children?: Equipment[];
}

const plant: Equipment[] = [
  {
    id: 'plant',
    name: 'North annex plant',
    children: [
      {
        id: 'boiler-house',
        name: 'Boiler house',
        children: [
          {
            id: 'boiler-1',
            name: 'Boiler 1',
            alarm: true,
            children: [
              { id: 'boiler-1-burner', name: 'Burner' },
              { id: 'boiler-1-feed', name: 'Feed pump' },
            ],
          },
          { id: 'boiler-2', name: 'Boiler 2' },
        ],
      },
      { id: 'cooling', name: 'Cooling tower' },
    ],
  },
];

export default function Actions() {
  const [log, setLog] = useState('No action taken yet.');

  return (
    <SpaceBetween size="m">
      <TreeView
        items={plant}
        ariaLabel="Plant equipment"
        getItemId={item => item.id}
        getItemChildren={item => item.children}
        renderItem={item => ({
          content: (
            <SpaceBetween direction="horizontal" size="xs" alignItems="center">
              <span>{item.name}</span>
              {item.alarm && <Badge tone="fault">Alarm</Badge>}
            </SpaceBetween>
          ),
          announcementLabel: item.alarm ? `${item.name}, alarm` : item.name,
          actions: (
            <ButtonDropdown
              variant="inline-icon"
              ariaLabel={`Actions for ${item.name}`}
              items={[
                { id: 'inspect', text: 'Log an inspection' },
                { id: 'isolate', text: 'Isolate' },
              ]}
              onItemClick={event =>
                setLog(`${event.detail.id === 'inspect' ? 'Inspection logged' : 'Isolated'}: ${item.name}.`)
              }
            />
          ),
        })}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {log}
      </Box>
    </SpaceBetween>
  );
}
