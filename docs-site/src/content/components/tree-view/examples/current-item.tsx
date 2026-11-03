// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Icon from '@ordinate/components/icon';
import SpaceBetween from '@ordinate/components/space-between';
import TreeView from '@ordinate/components/tree-view';

interface File {
  path: string;
  name: string;
  size?: string;
  children?: File[];
}

const files: File[] = [
  {
    path: 'src',
    name: 'src',
    children: [
      {
        path: 'src/button',
        name: 'button',
        children: [
          { path: 'src/button/index.tsx', name: 'index.tsx', size: '1.2 KB' },
          { path: 'src/button/internal.tsx', name: 'internal.tsx', size: '6.8 KB' },
          { path: 'src/button/styles.scss', name: 'styles.scss', size: '3.1 KB' },
        ],
      },
      { path: 'src/index.ts', name: 'index.ts', size: '0.4 KB' },
    ],
  },
  { path: 'package.json', name: 'package.json', size: '2.0 KB' },
];

export default function CurrentItem() {
  const [open, setOpen] = useState('src/button/internal.tsx');
  const [expanded, setExpanded] = useState<ReadonlyArray<string>>(['src', 'src/button']);

  return (
    <SpaceBetween size="m">
      <TreeView
        items={files}
        ariaLabel="Files of the repository"
        getItemId={file => file.path}
        getItemChildren={file => file.children}
        currentItemId={open}
        expandedItems={expanded}
        onItemToggle={({ detail }) =>
          setExpanded(current => (detail.expanded ? [...current, detail.id] : current.filter(id => id !== detail.id)))
        }
        renderItem={file => ({
          icon: <Icon name={file.children ? 'folder' : 'file'} />,
          content: file.name,
          secondaryContent: file.size,
          actions: file.children ? undefined : (
            <Button
              variant="icon"
              iconName="file-open"
              ariaLabel={`Open ${file.name}`}
              onClick={() => setOpen(file.path)}
            />
          ),
        })}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        Open in the editor: {open}
      </Box>
    </SpaceBetween>
  );
}
