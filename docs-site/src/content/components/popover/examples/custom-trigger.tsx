// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Popover from '@ordinate/components/popover';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';

export default function CustomTrigger() {
  return (
    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
      <Box variant="strong">Node na-03</Box>
      <Popover
        triggerType="custom"
        position="bottom"
        size="small"
        header="Health checks"
        content={
          <SpaceBetween size="xxs">
            <StatusIndicator type="success">Disk</StatusIndicator>
            <StatusIndicator type="success">Network</StatusIndicator>
            <StatusIndicator type="warning">Memory at 91%</StatusIndicator>
          </SpaceBetween>
        }
      >
        <Button variant="icon" iconName="note" ariaLabel="Health checks of na-03" />
      </Popover>
    </SpaceBetween>
  );
}
