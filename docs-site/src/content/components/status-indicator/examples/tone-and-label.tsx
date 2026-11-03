// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import KeyValuePairs from '@ordinate/components/key-value-pairs';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';

export default function ToneAndLabel() {
  return (
    <KeyValuePairs
      columns={3}
      items={[
        {
          label: 'Last backups',
          value: (
            <SpaceBetween size="xxs">
              <StatusIndicator state="complete" iconAriaLabel="Succeeded">
                31 Oct 2026, 02:14 UTC
              </StatusIndicator>
              <StatusIndicator state="fault" iconAriaLabel="Failed">
                30 Oct 2026, 02:10 UTC
              </StatusIndicator>
            </SpaceBetween>
          ),
        },
        {
          label: 'Scheduled scale-down',
          value: (
            <StatusIndicator state="waiting" tone="caution">
              Starts in 10 minutes
            </StatusIndicator>
          ),
        },
        {
          label: 'Primary node',
          value: (
            <StatusIndicator state="complete" wrapText={false}>
              north-annex-web-production-blue-07.us-mountain-1.internal
            </StatusIndicator>
          ),
        },
      ]}
    />
  );
}
