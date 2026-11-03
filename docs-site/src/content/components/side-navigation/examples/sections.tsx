// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import SideNavigation, { SideNavigationProps } from '@ordinate/components/side-navigation';
import SpaceBetween from '@ordinate/components/space-between';

const items: SideNavigationProps.Item[] = [
  { type: 'link', text: 'Dashboard', href: '#/dashboard' },
  {
    type: 'section',
    text: 'Compute',
    items: [
      { type: 'link', text: 'Nodes', href: '#/nodes' },
      { type: 'link', text: 'Images', href: '#/images' },
      { type: 'link', text: 'Autoscaling', href: '#/autoscaling' },
    ],
  },
  {
    type: 'section',
    text: 'Storage',
    defaultExpanded: false,
    items: [
      { type: 'link', text: 'Volumes', href: '#/volumes' },
      { type: 'link', text: 'Snapshots', href: '#/snapshots' },
    ],
  },
  {
    type: 'section',
    text: 'Network',
    defaultExpanded: false,
    items: [
      { type: 'link', text: 'Load balancers', href: '#/load-balancers' },
      { type: 'link', text: 'Firewall rules', href: '#/firewall' },
    ],
  },
];

export default function Sections() {
  const [activeHref, setActiveHref] = useState('#/images');
  const [change, setChange] = useState('No section toggled yet.');

  return (
    <SpaceBetween size="m">
      <SideNavigation
        header={{ text: 'Ordinate Cloud', href: '#/' }}
        items={items}
        activeHref={activeHref}
        onFollow={event => {
          event.preventDefault();
          setActiveHref(event.detail.href);
        }}
        onChange={event =>
          setChange(`${event.detail.item.text} ${event.detail.expanded ? 'expanded' : 'collapsed'}.`)
        }
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {change}
      </Box>
    </SpaceBetween>
  );
}
