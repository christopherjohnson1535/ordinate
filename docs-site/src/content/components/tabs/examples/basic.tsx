// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import KeyValuePairs from '@ordinate/components/key-value-pairs';
import StatusIndicator from '@ordinate/components/status-indicator';
import Tabs from '@ordinate/components/tabs';

export default function Basic() {
  const [activeTabId, setActiveTabId] = useState('details');

  return (
    <Tabs
      ariaLabel="Service atrium-api"
      activeTabId={activeTabId}
      onChange={event => setActiveTabId(event.detail.activeTabId)}
      tabs={[
        {
          id: 'details',
          label: 'Details',
          content: (
            <KeyValuePairs
              columns={3}
              items={[
                { label: 'Status', value: <StatusIndicator state="complete">Running</StatusIndicator> },
                { label: 'Image', value: 'api:v7' },
                { label: 'Region', value: 'us-mountain-1' },
              ]}
            />
          ),
        },
        { id: 'nodes', label: 'Nodes', content: 'Six nodes, all healthy. The last one joined 2 hours ago.' },
        { id: 'logs', label: 'Logs', content: '14:03 Health check passed on na-04 after 2 retries.' },
        {
          id: 'billing',
          label: 'Billing',
          disabled: true,
          disabledReason: 'Only project owners can see billing.',
        },
      ]}
    />
  );
}
