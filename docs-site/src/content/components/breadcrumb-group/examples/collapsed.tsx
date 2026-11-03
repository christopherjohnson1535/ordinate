// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import BreadcrumbGroup from '@ordinate/components/breadcrumb-group';
import Grid from '@ordinate/components/grid';
import SpaceBetween from '@ordinate/components/space-between';

const path = [
  { text: 'Harbour & Pine', href: '#/studio' },
  { text: 'Projects', href: '#/studio/projects' },
  { text: 'Reading room', href: '#/studio/projects/reading-room' },
  { text: 'Drawing sets', href: '#/studio/projects/reading-room/sets' },
  { text: 'Construction issue', href: '#/studio/projects/reading-room/sets/construction' },
  { text: 'A-101 Ground floor plan', href: '#/studio/projects/reading-room/sets/construction/a-101' },
];

export default function Collapsed() {
  const [followed, setFollowed] = useState('Nothing followed yet.');

  return (
    <SpaceBetween size="m">
      <Grid gridDefinition={[{ colspan: { default: 12, xs: 7 } }]}>
        <BreadcrumbGroup
          items={path}
          expandAriaLabel="Show the hidden folders"
          onFollow={event => {
            event.preventDefault();
            setFollowed(`Followed ${event.detail.text}`);
          }}
        />
      </Grid>
      <Box color="text-body-secondary" fontSize="body-s">
        {followed}
      </Box>
    </SpaceBetween>
  );
}
