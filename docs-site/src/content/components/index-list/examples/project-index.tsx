// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import IndexList from '@ordinate/components/index-list';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';

export default function ProjectIndex() {
  const [opened, setOpened] = useState('No project opened yet.');

  return (
    <StyleScope styleName="studio">
      <SpaceBetween size="m">
        <IndexList
          ariaLabel="Selected projects"
          variant="numbered"
          ordered={true}
          onFollow={event => {
            // A router would show the project page here instead of loading a new page.
            event.preventDefault();
            setOpened(`Routed on the client to ${event.detail.href} (row ${event.detail.id})`);
          }}
          items={[
            { id: 'harbour', label: 'Harbour House', meta: 'Residential', value: '2025', href: '/work/harbour-house' },
            { id: 'chair', label: 'Oak chair, no. 4', meta: 'Furniture', value: '2024', href: '/work/oak-chair' },
            { id: 'library', label: 'Reading room', meta: 'Public library', value: '2023', href: '/work/reading-room' },
            { id: 'hills', label: 'Studio in the hills', meta: 'Workplace, under construction', value: '2026' },
          ]}
        />
        <Box color="text-body-secondary" fontSize="body-s">
          {opened}
        </Box>
      </SpaceBetween>
    </StyleScope>
  );
}
