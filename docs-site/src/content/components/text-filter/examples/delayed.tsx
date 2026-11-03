// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';
import TextFilter from '@ordinate/components/text-filter';

export default function Delayed() {
  const [filteringText, setFilteringText] = useState('');
  const [requests, setRequests] = useState<string[]>([]);

  return (
    <SpaceBetween size="m">
      <TextFilter
        filteringText={filteringText}
        onChange={event => setFilteringText(event.detail.filteringText)}
        onDelayedChange={event => setRequests(current => [...current, event.detail.filteringText].slice(-4))}
        filteringPlaceholder="Find log lines"
        filteringAriaLabel="Find log lines"
      />
      <Box color="text-body-secondary" fontSize="body-s">
        {requests.length === 0
          ? 'Type to send a request.'
          : `Requests sent: ${requests.map(text => `"${text}"`).join(', ')}`}
      </Box>
    </SpaceBetween>
  );
}
