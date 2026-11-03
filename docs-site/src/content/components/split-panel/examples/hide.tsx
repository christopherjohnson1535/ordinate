// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '@ordinate/components/app-layout';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';
import SplitPanel from '@ordinate/components/split-panel';

export default function Hide() {
  const [open, setOpen] = useState(false);

  return (
    <AppLayout
      disableBodyScroll={true}
      navigationHide={true}
      toolsHide={true}
      splitPanelOpen={open}
      onSplitPanelToggle={event => setOpen(event.detail.open)}
      splitPanel={
        <SplitPanel header="Ticket 2041" closeBehavior="hide" hidePreferencesButton={true}>
          Town bike, rear brake. Pads worn to the metal; quote sent at 9:40.
        </SplitPanel>
      }
      content={
        <SpaceBetween size="s">
          <Box variant="p">
            {open ? 'Close the panel and it leaves no bar behind.' : 'The panel is hidden until you open it.'}
          </Box>
          <Button onClick={() => setOpen(true)} disabled={open}>
            Show ticket 2041
          </Button>
        </SpaceBetween>
      }
    />
  );
}
