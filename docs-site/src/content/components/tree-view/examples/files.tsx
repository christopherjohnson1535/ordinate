// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Icon from '@ordinate/components/icon';
import SpaceBetween from '@ordinate/components/space-between';
import TreeView, { TreeViewProps } from '@ordinate/components/tree-view';

interface Entry {
  id: string;
  name: string;
  detail?: string;
  children?: Entry[];
}

const drawings: Entry[] = [
  {
    id: 'hut-3',
    name: 'Hut No. 3',
    detail: '3 sets',
    children: [
      {
        id: 'hut-3/plans',
        name: 'Plans',
        children: [
          { id: 'hut-3/plans/a-101', name: 'A-101 Ground floor', detail: 'Rev 2' },
          { id: 'hut-3/plans/a-102', name: 'A-102 Roof', detail: 'Rev 1' },
        ],
      },
      { id: 'hut-3/elevations', name: 'Elevations', children: [{ id: 'hut-3/elevations/a-201', name: 'A-201 South' }] },
      { id: 'hut-3/doors', name: 'Door schedule', detail: 'Draft' },
    ],
  },
  {
    id: 'reading-room',
    name: 'Reading room',
    detail: '1 set',
    children: [{ id: 'reading-room/a-101', name: 'A-101 Plan' }],
  },
];

export default function Files() {
  const [expanded, setExpanded] = useState<ReadonlyArray<string>>(['hut-3', 'hut-3/plans']);

  const onItemToggle: TreeViewProps<Entry>['onItemToggle'] = event => {
    const { id, expanded: isExpanded } = event.detail;
    setExpanded(current => (isExpanded ? [...current, id] : current.filter(other => other !== id)));
  };

  return (
    <SpaceBetween size="s">
      <Box variant="h4" id="tree-files-title">
        Drawings
      </Box>
      <TreeView
        items={drawings}
        ariaLabelledby="tree-files-title"
        getItemId={entry => entry.id}
        getItemChildren={entry => entry.children}
        expandedItems={expanded}
        onItemToggle={onItemToggle}
        renderItem={entry => ({
          content: entry.name,
          secondaryContent: entry.detail,
          icon: <Icon name={entry.children ? 'folder' : 'file'} />,
        })}
      />
    </SpaceBetween>
  );
}
