// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Button from '~components/button';
import Drawer from '~components/drawer';
import TextContent from '~components/text-content';

import { Breadcrumbs, DemoFrame, DemoPage, Help, Navigation, ProjectContent } from './common';

export default function AppLayoutDrawers() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>('activity');
  const [unread, setUnread] = useState(true);
  const [lastSize, setLastSize] = useState<string>('');

  const drawers: AppLayoutProps.Drawer[] = [
    {
      id: 'activity',
      trigger: { iconName: 'history' },
      ariaLabels: { drawerName: 'Activity' },
      resizable: true,
      defaultSize: 320,
      onResize: event => setLastSize(`${event.detail.id}: ${event.detail.size}px`),
      content: (
        <Drawer
          header="Activity"
          footer={
            <Button formAction="none" onClick={() => setActiveDrawerId(null)}>
              Done
            </Button>
          }
        >
          <TextContent>
            <ul>
              <li>Node 14 replaced after three failed health checks.</li>
              <li>Automatic scaling turned off by Dana Ruiz.</li>
              <li>Certificate renewed until October 2, 2027.</li>
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
            <p>Two nodes will restart during the maintenance window on November 4.</p>
          </TextContent>
        </Drawer>
      ),
    },
    {
      id: 'assistant',
      trigger: { iconName: 'assist' },
      ariaLabels: { drawerName: 'Assistant' },
      content: <Drawer header="Assistant" loading={true} loadingText="Starting the assistant" />,
    },
  ];

  return (
    <DemoPage
      title="App layout: drawers"
      description={`Drawers share the end of the line with the help panel; their triggers sit in the rail below the help toggle. Activity can be resized, Notifications shows a badge until it is opened. ${lastSize && `Last resize: ${lastSize}.`}`}
    >
      <DemoFrame>
        <AppLayout
          disableBodyScroll={true}
          navigation={<Navigation />}
          breadcrumbs={<Breadcrumbs />}
          tools={<Help />}
          drawers={drawers}
          activeDrawerId={activeDrawerId}
          onDrawerChange={event => {
            setActiveDrawerId(event.detail.activeDrawerId);
            if (event.detail.activeDrawerId === 'notifications') {
              setUnread(false);
            }
          }}
          content={<ProjectContent />}
        />
      </DemoFrame>
    </DemoPage>
  );
}
