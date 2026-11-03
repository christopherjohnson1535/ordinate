// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';

export default function States() {
  return (
    <ColumnLayout columns={2}>
      <SpaceBetween size="xs">
        <StatusIndicator state="note">Maintenance on Sunday</StatusIndicator>
        <StatusIndicator state="complete">Running</StatusIndicator>
        <StatusIndicator state="caution">Certificate expires in 6 days</StatusIndicator>
        <StatusIndicator state="fault">Failed health check</StatusIndicator>
        <StatusIndicator state="underway">Rolling out</StatusIndicator>
      </SpaceBetween>
      <SpaceBetween size="xs">
        <StatusIndicator state="waiting">Waiting for approval</StatusIndicator>
        <StatusIndicator state="queued">Not started</StatusIndicator>
        <StatusIndicator state="halted">Stopped</StatusIndicator>
        <StatusIndicator state="loading">Loading</StatusIndicator>
      </SpaceBetween>
    </ColumnLayout>
  );
}
