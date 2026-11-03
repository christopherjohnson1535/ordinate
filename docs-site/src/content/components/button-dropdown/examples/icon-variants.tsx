// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import ButtonDropdown, { ButtonDropdownProps } from '@ordinate/components/button-dropdown';
import SpaceBetween from '@ordinate/components/space-between';

const nodes = ['na-01', 'na-02', 'na-03'];

const rowActions: ButtonDropdownProps.Items = [
  { id: 'restart', text: 'Restart' },
  { id: 'drain', text: 'Drain jobs' },
  { id: 'remove', text: 'Remove from project' },
];

export default function IconVariants() {
  const [last, setLast] = useState('Nothing chosen yet.');

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="xs" alignItems="center">
        <Box variant="strong">Nodes in north-annex</Box>
        <ButtonDropdown
          variant="icon"
          ariaLabel="Project actions"
          items={[
            { id: 'add', text: 'Add a node', iconName: 'add' },
            { id: 'refresh', text: 'Refresh the list', iconName: 'refresh' },
          ]}
          onItemClick={event => setLast(`Project: "${event.detail.id}".`)}
        />
      </SpaceBetween>
      {nodes.map(node => (
        <SpaceBetween key={node} direction="horizontal" size="s" alignItems="center">
          <Box variant="code">{node}</Box>
          <Box color="text-body-secondary">us-mountain-1a</Box>
          <ButtonDropdown
            variant="inline-icon"
            ariaLabel={`Actions for ${node}`}
            items={rowActions}
            onItemClick={event => setLast(`${node}: "${event.detail.id}".`)}
          />
        </SpaceBetween>
      ))}
      <Box color="text-body-secondary" fontSize="body-s">
        {last}
      </Box>
    </SpaceBetween>
  );
}
