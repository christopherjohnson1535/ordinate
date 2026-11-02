// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import SegmentedControl from '~components/segmented-control';
import TitleBlock from '~components/title-block';
import Toggle from '~components/toggle';

import { Breadcrumbs, DemoFrame, DemoPage, Navigation, ProjectContent } from './common';

const contentTypes: AppLayoutProps.ContentType[] = ['default', 'form', 'table', 'dashboard'];
const notificationsPositions: AppLayoutProps.NotificationsPosition[] = ['margin', 'top'];

export default function AppLayoutNavigation() {
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [contentType, setContentType] = useState<AppLayoutProps.ContentType>('default');
  const [sticky, setSticky] = useState(true);
  const [notificationsPosition, setNotificationsPosition] = useState<AppLayoutProps.NotificationsPosition>('margin');
  const [showTitleBlock, setShowTitleBlock] = useState(true);
  const [items, setItems] = useState<FlashbarProps.MessageDefinition[]>([
    {
      id: 'maintenance',
      type: 'note',
      header: 'Scheduled maintenance on November 4',
      content: 'Nodes in us-mountain-1 restart one at a time between 02:00 and 04:00 MST.',
      dismissible: true,
      onDismiss: () => setItems([]),
    },
  ]);

  return (
    <DemoPage
      title="App layout: navigation"
      description="The content sits on a white sheet laid on the paper, with grid reference letters along the top and a title block along the foot. The navigation is a sheet index along the side and collapses to a rail with a single toggle. Notifications sit in the margin beside the sheet when there is room, or above the breadcrumbs, and when sticky they stay in view while the content scrolls. The content type sets the maximum content width."
      controls={
        <>
          <SegmentedControl
            label="Content type"
            selectedId={contentType}
            onChange={event => setContentType(event.detail.selectedId as AppLayoutProps.ContentType)}
            options={contentTypes.map(type => ({ id: type, text: type }))}
          />
          <SegmentedControl
            label="Notifications"
            selectedId={notificationsPosition}
            onChange={event =>
              setNotificationsPosition(event.detail.selectedId as AppLayoutProps.NotificationsPosition)
            }
            options={notificationsPositions.map(position => ({ id: position, text: position }))}
          />
          <Toggle checked={sticky} onChange={event => setSticky(event.detail.checked)}>
            Sticky notifications
          </Toggle>
          <Toggle checked={showTitleBlock} onChange={event => setShowTitleBlock(event.detail.checked)}>
            Title block
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
          notificationsPosition={notificationsPosition}
          stickyNotifications={sticky}
          titleBlock={
            showTitleBlock ? (
              <TitleBlock
                items={[
                  { label: 'Project', value: 'north-annex' },
                  { label: 'Sheet', value: 'A-02 Projects' },
                  { label: 'Revision', value: '△1' },
                  { label: 'Drawn', value: 'M. Okafor' },
                  { label: 'Checked', value: 'D. Ruiz' },
                ]}
              />
            ) : undefined
          }
          content={<ProjectContent sections={4} />}
        />
      </DemoFrame>
    </DemoPage>
  );
}
