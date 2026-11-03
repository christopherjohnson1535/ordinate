// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import AppLayout from '@ordinate/components/app-layout';
import Box from '@ordinate/components/box';
import Drawer from '@ordinate/components/drawer';
import Header from '@ordinate/components/header';

export default function Loading() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (activeDrawerId !== 'assistant') {
      return;
    }
    const timer = window.setTimeout(() => setLoaded(true), 1500);
    return () => window.clearTimeout(timer);
  }, [activeDrawerId]);

  return (
    <AppLayout
      disableBodyScroll={true}
      navigationHide={true}
      activeDrawerId={activeDrawerId}
      onDrawerChange={event => {
        setActiveDrawerId(event.detail.activeDrawerId);
        setLoaded(false);
      }}
      drawers={[
        {
          id: 'assistant',
          trigger: { iconName: 'assist' },
          ariaLabels: { drawerName: 'Assistant' },
          content: (
            <Drawer header="Assistant" loading={!loaded} loadingText="Starting the assistant">
              <Box variant="p">Ask about the nodes, deploys and logs of north-annex.</Box>
            </Drawer>
          ),
        },
      ]}
      content={
        <>
          <Header variant="h1">north-annex</Header>
          <Box variant="p">Open the assistant from the rail at the end of the line.</Box>
        </>
      }
    />
  );
}
