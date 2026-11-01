// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import SegmentedControl from '~components/segmented-control';
import Toggle from '~components/toggle';

import { Breadcrumbs, DemoFrame, DemoPage, Navigation, ProjectContent } from './common';

const contentTypes: AppLayoutProps.ContentType[] = ['default', 'form', 'table', 'dashboard'];

export default function AppLayoutNavigation() {
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [contentType, setContentType] = useState<AppLayoutProps.ContentType>('default');
  const [sticky, setSticky] = useState(true);
  const [items, setItems] = useState<FlashbarProps.MessageDefinition[]>([
    {
      id: 'maintenance',
      type: 'info',
      header: 'Scheduled maintenance on November 4',
      content: 'Nodes in us-mountain-1 restart one at a time between 02:00 and 04:00 MST.',
      dismissible: true,
      onDismiss: () => setItems([]),
    },
  ]);

  return (
    <DemoPage
      title="App layout: navigation"
      description="The navigation collapses to a rail with a single toggle. Notifications stay above the breadcrumbs and, when sticky, stay in view while the content scrolls. The content type sets the maximum content width."
      controls={
        <>
          <SegmentedControl
            label="Content type"
            selectedId={contentType}
            onChange={event => setContentType(event.detail.selectedId as AppLayoutProps.ContentType)}
            options={contentTypes.map(type => ({ id: type, text: type }))}
          />
          <Toggle checked={sticky} onChange={event => setSticky(event.detail.checked)}>
            Sticky notifications
          </Toggle>
        </>
      }
    >
      <DemoFrame>
        <AppLayout
          disableBodyScroll={true}
          contentType={contentType}
          navigation={<Navigation />}
          navigationOpen={navigationOpen}
          onNavigationChange={event => setNavigationOpen(event.detail.open)}
          toolsHide={true}
          breadcrumbs={<Breadcrumbs />}
          notifications={<Flashbar items={items} />}
          stickyNotifications={sticky}
          content={<ProjectContent sections={4} />}
        />
      </DemoFrame>
    </DemoPage>
  );
}
