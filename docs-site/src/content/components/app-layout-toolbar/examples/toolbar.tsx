// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayoutToolbar, { AppLayoutToolbarProps } from '@ordinate/components/app-layout-toolbar';
import Box from '@ordinate/components/box';
import BreadcrumbGroup from '@ordinate/components/breadcrumb-group';
import SpaceBetween from '@ordinate/components/space-between';

export default function Toolbar() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [unread, setUnread] = useState(true);

  const drawers: AppLayoutToolbarProps.Drawer[] = [
    { id: 'help', ariaLabel: 'Help panel', iconName: 'note' },
    { id: 'activity', ariaLabel: 'Activity', iconName: 'history' },
    { id: 'notifications', ariaLabel: 'Notifications', iconName: 'notification', badge: unread },
  ];

  return (
    <SpaceBetween size="m">
      <AppLayoutToolbar
        breadcrumbs={
          <BreadcrumbGroup
            items={[
              { text: 'North Annex', href: 'https://example.com/north-annex' },
              { text: 'Services', href: 'https://example.com/north-annex/services' },
              { text: 'vault-store', href: 'https://example.com/north-annex/services/vault-store' },
            ]}
            onFollow={event => event.preventDefault()}
          />
        }
        navigationOpen={navigationOpen}
        onNavigationChange={event => setNavigationOpen(event.detail.open)}
        drawers={drawers}
        activeDrawerId={activeDrawerId}
        onDrawerChange={event => {
          setActiveDrawerId(event.detail.activeDrawerId);
          if (event.detail.activeDrawerId === 'notifications') {
            setUnread(false);
          }
        }}
      />
      <Box padding={{ horizontal: 'l' }} color="text-body-secondary">
        Navigation {navigationOpen ? 'open' : 'closed'}. Open drawer: {activeDrawerId ?? 'none'}.
      </Box>
    </SpaceBetween>
  );
}
