// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Grid from '@ordinate/components/grid';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import TopNavigation, { TopNavigationProps } from '@ordinate/components/top-navigation';

const widths: Record<string, number> = { wide: 12, medium: 8, narrow: 5 };

export default function Narrow() {
  const [width, setWidth] = useState('medium');
  const [log, setLog] = useState('Nothing chosen yet.');

  const utilities: TopNavigationProps.Utility[] = [
    { type: 'button', text: 'Status', iconName: 'underway', onClick: () => setLog('Opened Status.') },
    { type: 'button', text: 'Support', iconName: 'support', onClick: () => setLog('Opened Support.') },
    {
      type: 'menu-dropdown',
      text: 'Settings',
      iconName: 'adjust',
      items: [
        { id: 'region', text: 'Language and region' },
        { id: 'theme', text: 'Theme' },
      ],
      onItemClick: event => setLog(`Settings: ${event.detail.id}.`),
    },
    {
      type: 'button',
      text: 'Sign out',
      iconName: 'sign-out',
      disableUtilityCollapse: true,
      onClick: () => setLog('Signed out.'),
    },
  ];

  return (
    <SpaceBetween size="m">
      <SegmentedControl
        label="Width of the bar"
        selectedId={width}
        onChange={event => setWidth(event.detail.selectedId)}
        options={[
          { id: 'wide', text: 'Wide' },
          { id: 'medium', text: 'Medium' },
          { id: 'narrow', text: 'Narrow' },
        ]}
      />
      <Grid gridDefinition={[{ colspan: widths[width] }]}>
        <TopNavigation
          identity={{
            href: '#/components/top-navigation',
            title: 'Fixit Bikes',
            onFollow: event => event.preventDefault(),
          }}
          utilities={utilities}
        />
      </Grid>
      <Box color="text-body-secondary" fontSize="body-s">
        {log}
      </Box>
    </SpaceBetween>
  );
}
