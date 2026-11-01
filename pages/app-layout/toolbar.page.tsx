// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Drawer from '~components/drawer';
import TextContent from '~components/text-content';

import { Breadcrumbs, DemoFrame, DemoPage, Help, Navigation, ProjectContent } from './common';

export default function AppLayoutToolbarVariant() {
  return (
    <DemoPage
      title="App layout: toolbar variant"
      description="With variant toolbar, a toolbar above the content holds the breadcrumbs and every toggle, and closed panels take no space. The layout state is left to the layout here: no open props are set."
    >
      <DemoFrame>
        <AppLayout
          disableBodyScroll={true}
          variant="toolbar"
          navigation={<Navigation />}
          breadcrumbs={<Breadcrumbs />}
          tools={<Help />}
          drawers={[
            {
              id: 'activity',
              trigger: { iconName: 'history' },
              ariaLabels: { drawerName: 'Activity' },
              resizable: true,
              content: (
                <Drawer header="Activity">
                  <TextContent>
                    <p>Node 14 replaced after three failed health checks.</p>
                  </TextContent>
                </Drawer>
              ),
            },
          ]}
          content={<ProjectContent />}
        />
      </DemoFrame>
    </DemoPage>
  );
}
