// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Calendar from '@ordinate/components/calendar';
import SpaceBetween from '@ordinate/components/space-between';

// Invoices exist only for months that have closed, up to October 2026.
const lastClosedMonth = new Date(2026, 9, 1);

export default function Month() {
  const [value, setValue] = useState('2026-09');

  return (
    <SpaceBetween size="s">
      <Calendar
        granularity="month"
        value={value}
        onChange={event => setValue(event.detail.value)}
        ariaLabel="Billing period"
        isDateEnabled={date => date <= lastClosedMonth}
        dateDisabledReason={() => 'This month has not closed yet.'}
      />
      <Box color="text-body-secondary" fontSize="body-s">
        Showing the invoice for {value}
      </Box>
    </SpaceBetween>
  );
}
