// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '@ordinate/components/app-layout';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Flashbar, { FlashbarProps } from '@ordinate/components/flashbar';
import Header from '@ordinate/components/header';
import SpaceBetween from '@ordinate/components/space-between';

export default function Notifications() {
  const [deploys, setDeploys] = useState<number[]>([]);

  const items: FlashbarProps.MessageDefinition[] = deploys.map(number => ({
    id: String(number),
    type: 'complete',
    header: `Deploy ${number} finished`,
    content: 'All three zones of north-annex-web run web:v2.',
    dismissible: true,
    dismissLabel: `Dismiss deploy ${number}`,
    onDismiss: () => setDeploys(current => current.filter(item => item !== number)),
  }));

  return (
    <AppLayout
      disableBodyScroll={true}
      navigationHide={true}
      toolsHide={true}
      stickyNotifications={true}
      notifications={<Flashbar items={items} />}
      content={
        <SpaceBetween size="m">
          <Header
            variant="h1"
            actions={
              <Button variant="primary" onClick={() => setDeploys(current => [...current, current.length + 1])}>
                Deploy
              </Button>
            }
          >
            Deployments
          </Header>
          <Box variant="p" color="text-body-secondary">
            {deploys.length === 0
              ? 'No notifications. The empty Flashbar takes no space.'
              : `${deploys.length} notifications. Dismiss them with their close buttons.`}
          </Box>
        </SpaceBetween>
      }
    />
  );
}
