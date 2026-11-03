// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '@ordinate/components/badge';
import Box from '@ordinate/components/box';
import SideNavigation, { SideNavigationProps } from '@ordinate/components/side-navigation';
import SpaceBetween from '@ordinate/components/space-between';

const items: SideNavigationProps.Item[] = [
  { type: 'link', text: 'Overview', href: '#/north-annex' },
  {
    type: 'section-group',
    title: 'Resources',
    items: [
      { type: 'link', text: 'Services', href: '#/north-annex/services' },
      { type: 'link', text: 'Nodes', href: '#/north-annex/nodes', info: <Badge tone="fault">1</Badge> },
      { type: 'link', text: 'Volumes', href: '#/north-annex/volumes' },
    ],
  },
  {
    type: 'section-group',
    title: 'Operations',
    items: [
      { type: 'link', text: 'Deployments', href: '#/north-annex/deployments' },
      { type: 'link', text: 'Logs', href: '#/north-annex/logs' },
    ],
  },
  { type: 'divider' },
  { type: 'link', text: 'Status page', href: 'https://example.com/status', external: true },
];

export default function Basic() {
  const [activeHref, setActiveHref] = useState('#/north-annex/services');

  return (
    <SpaceBetween size="m">
      <SideNavigation
        header={{ text: 'North Annex', href: '#/north-annex' }}
        items={items}
        activeHref={activeHref}
        externalIconAriaLabel="Opens in a new tab"
        onFollow={event => {
          // External links open as usual; the rest are routed in the page.
          if (!event.detail.external) {
            event.preventDefault();
            setActiveHref(event.detail.href);
          }
        }}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        Current page: {activeHref}
      </Box>
    </SpaceBetween>
  );
}
