// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '@ordinate/components/app-layout';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Drawer from '@ordinate/components/drawer';
import Header from '@ordinate/components/header';
import SpaceBetween from '@ordinate/components/space-between';
import TextContent from '@ordinate/components/text-content';

const events = [
  'Node 14 replaced after three failed health checks.',
  'Automatic scaling turned off by Dana Ruiz.',
  'Certificate renewed until 2 October 2027.',
  'Firewall rule web-ingress updated.',
];

export default function InAppLayout() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>('activity');
  const [cleared, setCleared] = useState(false);

  return (
    <AppLayout
      disableBodyScroll={true}
      navigationHide={true}
      activeDrawerId={activeDrawerId}
      onDrawerChange={event => setActiveDrawerId(event.detail.activeDrawerId)}
      drawers={[
        {
          id: 'activity',
          trigger: { iconName: 'history' },
          ariaLabels: { drawerName: 'Activity' },
          content: (
            <Drawer
              kind="resource"
              reference="R4"
              header="Activity"
              footer={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button variant="link" onClick={() => setCleared(true)}>
                    Clear
                  </Button>
                  <Button onClick={() => setActiveDrawerId(null)}>Done</Button>
                </SpaceBetween>
              }
            >
              {cleared ? (
                <Box color="text-body-secondary">No new activity.</Box>
              ) : (
                <TextContent>
                  <ul>
                    {events.map(event => (
                      <li key={event}>{event}</li>
                    ))}
                  </ul>
                </TextContent>
              )}
            </Drawer>
          ),
        },
      ]}
      content={<Header variant="h1">north-annex</Header>}
    />
  );
}
