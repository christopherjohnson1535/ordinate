// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '@ordinate/components/app-layout';
import Box from '@ordinate/components/box';
import Drawer from '@ordinate/components/drawer';
import Header from '@ordinate/components/header';
import Table from '@ordinate/components/table';

const nodes = [
  { name: 'na-01', zone: '1a', uptime: '30 days' },
  { name: 'na-02', zone: '1b', uptime: '30 days' },
  { name: 'na-11', zone: '1c', uptime: '6 hours' },
  { name: 'na-12', zone: '1a', uptime: '5 hours' },
];

export default function FullBleed() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>('nodes');

  return (
    <AppLayout
      disableBodyScroll={true}
      navigationHide={true}
      activeDrawerId={activeDrawerId}
      onDrawerChange={event => setActiveDrawerId(event.detail.activeDrawerId)}
      drawers={[
        {
          id: 'nodes',
          trigger: { iconName: 'list-view' },
          ariaLabels: { drawerName: 'Recent nodes' },
          content: (
            <Drawer header="Recent nodes" disableContentPaddings={true}>
              <Table
                variant="embedded"
                items={nodes}
                columnDefinitions={[
                  { id: 'name', header: 'Node', cell: item => item.name },
                  { id: 'zone', header: 'Zone', cell: item => item.zone },
                  { id: 'uptime', header: 'Uptime', cell: item => item.uptime },
                ]}
              />
            </Drawer>
          ),
        },
      ]}
      content={
        <>
          <Header variant="h1">north-annex</Header>
          <Box variant="p">20 nodes in us-mountain-1.</Box>
        </>
      }
    />
  );
}
