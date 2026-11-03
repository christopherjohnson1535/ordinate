// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Calendar from '@ordinate/components/calendar';
import ColumnLayout from '@ordinate/components/column-layout';
import SpaceBetween from '@ordinate/components/space-between';

export default function Locale() {
  const [value, setValue] = useState('2026-11-14');

  return (
    <ColumnLayout columns={2}>
      <SpaceBetween size="xs">
        <Box variant="key-label">de-DE, week from Monday</Box>
        <Calendar
          locale="de-DE"
          value={value}
          onChange={event => setValue(event.detail.value)}
          ariaLabel="Besuchstermin"
          i18nStrings={{
            previousMonthAriaLabel: 'Vorheriger Monat',
            nextMonthAriaLabel: 'Nächster Monat',
            todayAriaLabel: 'Heute',
          }}
        />
      </SpaceBetween>
      <SpaceBetween size="xs">
        <Box variant="key-label">en-US, week from Sunday</Box>
        <Calendar
          locale="en-US"
          startOfWeek={0}
          value={value}
          onChange={event => setValue(event.detail.value)}
          ariaLabel="Site visit"
        />
      </SpaceBetween>
    </ColumnLayout>
  );
}
