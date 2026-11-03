// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import PanelLayout from '@ordinate/components/panel-layout';
import SideNavigation from '@ordinate/components/side-navigation';

const base = 'https://example.com/fixit-bikes/queue';

export default function Resizable() {
  const [size, setSize] = useState(240);
  const [activeHref, setActiveHref] = useState(`${base}/2041`);

  return (
    <PanelLayout
      resizable={true}
      panelSize={size}
      minPanelSize={180}
      maxPanelSize={400}
      onPanelResize={event => setSize(event.detail.panelSize)}
      panelFocusable={{ ariaLabel: 'Repair queue' }}
      panelContent={
        <SideNavigation
          header={{ text: 'Repair queue', href: base }}
          activeHref={activeHref}
          onFollow={event => {
            event.preventDefault();
            setActiveHref(event.detail.href);
          }}
          items={[
            { type: 'link', text: '2041, rear brake', href: `${base}/2041` },
            { type: 'link', text: '2042, puncture', href: `${base}/2042` },
            { type: 'link', text: '2043, gears', href: `${base}/2043` },
          ]}
        />
      }
      mainContent={
        <Box padding="l">
          <Box variant="h3">Ticket {activeHref.split('/').pop()}</Box>
          <Box variant="p">Drag the handle, or focus it and use the arrow keys. The panel is {size} px wide.</Box>
        </Box>
      }
    />
  );
}
