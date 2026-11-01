// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Drawer from '~components/drawer';
import SideNavigation from '~components/side-navigation';
import SplitPanel from '~components/split-panel';
import TextContent from '~components/text-content';

import { Breadcrumbs, DemoFrame, DemoPage, Help, ProjectContent } from './common';

export default function AppLayoutMobile() {
  const layoutRef = useRef<AppLayoutProps.Ref>(null);
  const [splitPanelOpen, setSplitPanelOpen] = useState(false);

  return (
    <DemoPage
      title="App layout: narrow screens"
      description="Below 688px the layout switches to a toolbar with the navigation toggle, breadcrumbs and panel triggers. The navigation and the panels cover the content, close with Escape, and return focus to their toggle. The split panel stays at the bottom."
    >
      <DemoFrame narrow={true}>
        <AppLayout
          ref={layoutRef}
          disableBodyScroll={true}
          navigation={
            <SideNavigation
              header={{ text: 'Compute', href: '#/' }}
              activeHref="#/projects"
              onFollow={event => {
                event.preventDefault();
                layoutRef.current?.closeNavigationIfNecessary();
              }}
              items={[
                { type: 'link', text: 'Dashboard', href: '#/dashboard' },
                { type: 'link', text: 'Projects', href: '#/projects' },
                { type: 'link', text: 'Billing', href: '#/billing' },
              ]}
            />
          }
          breadcrumbs={<Breadcrumbs />}
          tools={<Help />}
          drawers={[
            {
              id: 'activity',
              trigger: { iconName: 'history' },
              ariaLabels: { drawerName: 'Activity' },
              badge: true,
              content: (
                <Drawer header="Activity">
                  <TextContent>
                    <p>Node 14 replaced after three failed health checks.</p>
                  </TextContent>
                </Drawer>
              ),
            },
          ]}
          splitPanelOpen={splitPanelOpen}
          onSplitPanelToggle={event => setSplitPanelOpen(event.detail.open)}
          splitPanel={
            <SplitPanel header="na-01">
              <TextContent>
                <p>Healthy, in us-mountain-1a.</p>
              </TextContent>
            </SplitPanel>
          }
          content={<ProjectContent sections={2} />}
        />
      </DemoFrame>
    </DemoPage>
  );
}
