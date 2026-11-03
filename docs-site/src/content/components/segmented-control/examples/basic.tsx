// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';

const periods: Record<string, string> = {
  hour: 'the last hour',
  day: 'the last 24 hours',
  week: 'the last 7 days',
  month: 'the last 30 days',
};

export default function Basic() {
  const [period, setPeriod] = useState('day');

  return (
    <SpaceBetween size="m" alignItems="center">
      <SegmentedControl
        label="Time range"
        selectedId={period}
        onChange={event => setPeriod(event.detail.selectedId)}
        options={[
          { id: 'hour', text: '1h' },
          { id: 'day', text: '24h' },
          { id: 'week', text: '7d' },
          { id: 'month', text: '30d' },
        ]}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        Showing requests from {periods[period]}.
      </Box>
    </SpaceBetween>
  );
}
