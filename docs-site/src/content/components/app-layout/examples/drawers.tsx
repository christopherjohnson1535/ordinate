// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout, { AppLayoutProps } from '@ordinate/components/app-layout';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Drawer from '@ordinate/components/drawer';
import Header from '@ordinate/components/header';
import HelpPanel from '@ordinate/components/help-panel';
import SpaceBetween from '@ordinate/components/space-between';
import TextContent from '@ordinate/components/text-content';

export default function Drawers() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>('activity');
  const [unread, setUnread] = useState(true);
  const [width, setWidth] = useState(320);

  const drawers: AppLayoutProps.Drawer[] = [
    {
      id: 'activity',
      trigger: { iconName: 'history' },
      ariaLabels: { drawerName: 'Activity' },
      resizable: true,
      defaultSize: 320,
      onResize: event => setWidth(event.detail.size),
      content: (
        <Drawer header="Activity" footer={<Button onClick={() => setActiveDrawerId(null)}>Done</Button>}>
          <TextContent>
            <ul>
              <li>Node 14 replaced after three failed health checks.</li>
              <li>Automatic scaling turned off by Dana Ruiz.</li>
              <li>Certificate renewed until 2 October 2027.</li>
            </ul>
          </TextContent>
        </Drawer>
      ),
    },
    {
      id: 'notifications',
      trigger: { iconName: 'notification' },
      ariaLabels: { drawerName: 'Notifications' },
      badge: unread,
      content: (
        <Drawer header="Notifications">
          <TextContent>
            <p>Two nodes restart during the maintenance window on 4 November.</p>
          </TextContent>
        </Drawer>
      ),
    },
  ];

  return (
    <AppLayout
      disableBodyScroll={true}
      navigationHide={true}
      tools={
        <HelpPanel header="Nodes">
          <p>A node is one machine in the project. Replace a node to move its work to a fresh machine.</p>
        </HelpPanel>
      }
      drawers={drawers}
      activeDrawerId={activeDrawerId}
      onDrawerChange={event => {
        setActiveDrawerId(event.detail.activeDrawerId);
        if (event.detail.activeDrawerId === 'notifications') {
          setUnread(false);
        }
      }}
      content={
        <SpaceBetween size="m">
          <Header variant="h1">Nodes</Header>
          <Box variant="p">
            Open drawer: {activeDrawerId ?? 'none'}. The activity drawer is {width} px wide; drag its edge to resize it.
          </Box>
        </SpaceBetween>
      }
    />
  );
}
