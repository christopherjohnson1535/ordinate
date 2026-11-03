// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Checkbox from '@ordinate/components/checkbox';
import ColumnLayout from '@ordinate/components/column-layout';
import ItemCard from '@ordinate/components/item-card';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';

const nodes = [
  { name: 'node-01', type: 'm7.large', zone: 'us-mountain-1a', running: true },
  { name: 'node-02', type: 'm7.xlarge', zone: 'us-mountain-1b', running: true },
  { name: 'node-03', type: 'c7.large', zone: 'us-mountain-1c', running: false },
];

export default function Selection() {
  const [selected, setSelected] = useState<string[]>(['node-02']);

  const toggle = (name: string, checked: boolean) =>
    setSelected(current => (checked ? [...current, name] : current.filter(other => other !== name)));

  return (
    <SpaceBetween size="m">
      <ColumnLayout columns={3}>
        {nodes.map((node, index) => (
          <ItemCard
            key={node.name}
            header={node.name}
            description={`${node.type} in ${node.zone}`}
            reference={`R${index + 1}`}
            kind="resource"
            selected={selected.includes(node.name)}
            selectionControl={
              <Checkbox
                checked={selected.includes(node.name)}
                onChange={event => toggle(node.name, event.detail.checked)}
                ariaLabel={`Select ${node.name}`}
              />
            }
          >
            <StatusIndicator state={node.running ? 'complete' : 'halted'}>
              {node.running ? 'Running' : 'Stopped'}
            </StatusIndicator>
          </ItemCard>
        ))}
      </ColumnLayout>
      <Box color="text-body-secondary" fontSize="body-s">
        {selected.length === 0 ? 'No nodes selected.' : `Selected: ${selected.join(', ')}`}
      </Box>
    </SpaceBetween>
  );
}
