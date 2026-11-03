// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '@ordinate/components/app-layout';
import Box from '@ordinate/components/box';
import Divider from '@ordinate/components/divider';
import Drawer from '@ordinate/components/drawer';
import Header from '@ordinate/components/header';

const zones = [
  { zone: 'us-mountain-1a', nodes: 8, note: 'na-12 joined at 08:40.' },
  { zone: 'us-mountain-1b', nodes: 6, note: 'No changes today.' },
  { zone: 'us-mountain-1c', nodes: 6, note: 'na-11 joined at 07:55.' },
];

export default function FullBleed() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>('zones');

  return (
    <AppLayout
      disableBodyScroll={true}
      navigationHide={true}
      activeDrawerId={activeDrawerId}
      onDrawerChange={event => setActiveDrawerId(event.detail.activeDrawerId)}
      drawers={[
        {
          id: 'zones',
          trigger: { iconName: 'list-view' },
          ariaLabels: { drawerName: 'Zones' },
          content: (
            <Drawer header="Zones" disableContentPaddings={true}>
              {zones.map(item => (
                <React.Fragment key={item.zone}>
                  <Divider />
                  <Box padding={{ horizontal: 'l', vertical: 's' }}>
                    <Box variant="strong">{item.zone}</Box>
                    <Box color="text-body-secondary">
                      {item.nodes} nodes. {item.note}
                    </Box>
                  </Box>
                </React.Fragment>
              ))}
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
