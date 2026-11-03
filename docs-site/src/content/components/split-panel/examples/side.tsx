// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout, { AppLayoutProps } from '@ordinate/components/app-layout';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import Link from '@ordinate/components/link';
import SplitPanel from '@ordinate/components/split-panel';

export default function Side() {
  const [open, setOpen] = useState(true);
  const [preferences, setPreferences] = useState<AppLayoutProps.SplitPanelPreferences>({ position: 'side' });

  return (
    <AppLayout
      disableBodyScroll={true}
      navigationHide={true}
      toolsHide={true}
      minContentWidth={200}
      splitPanelOpen={open}
      onSplitPanelToggle={event => setOpen(event.detail.open)}
      splitPanelPreferences={preferences}
      onSplitPanelPreferencesChange={event => setPreferences(event.detail)}
      splitPanel={
        <SplitPanel
          header="na-14"
          headerTag="N14"
          headerDescription="Node in us-mountain-1a"
          headerInfo={<Link variant="info">Info</Link>}
          headerActions={<Button iconName="refresh">Restart</Button>}
        >
          <KeyValuePairs
            columns={1}
            items={[
              { label: 'Instance type', value: 'c7.large' },
              { label: 'Uptime', value: '12 days' },
              { label: 'Address', value: '10.0.4.12' },
            ]}
          />
        </SplitPanel>
      }
      content={
        <Box variant="p">
          The panel is at the {preferences.position} and {open ? 'open' : 'closed'}. Change its position with the
          preferences button in its header.
        </Box>
      }
    />
  );
}
