// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import NavigableGroup from '@ordinate/components/navigable-group';
import SpaceBetween from '@ordinate/components/space-between';

const tools = [
  { id: 'select', label: 'Select' },
  { id: 'line', label: 'Line' },
  { id: 'dimension', label: 'Dimension' },
  { id: 'note', label: 'Note' },
];

export default function Toolbar() {
  const [tool, setTool] = useState('Select');

  return (
    <SpaceBetween size="m">
      <NavigableGroup
        navigationDirection="horizontal"
        role="toolbar"
        ariaLabel="Drawing tools"
        loopFocus={true}
        getItemKey={element => element.dataset.toolId ?? ''}
      >
        <SpaceBetween direction="horizontal" size="xs">
          {tools.map(({ id, label }) => (
            <Button key={id} data-tool-id={id} onClick={() => setTool(label)}>
              {label}
            </Button>
          ))}
        </SpaceBetween>
      </NavigableGroup>
      <Box color="text-body-secondary" fontSize="body-s">
        Tool: {tool}. Tab into the toolbar, then use Left and Right, Home and End.
      </Box>
    </SpaceBetween>
  );
}
