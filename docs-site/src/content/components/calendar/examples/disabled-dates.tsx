// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Calendar from '@ordinate/components/calendar';
import SpaceBetween from '@ordinate/components/space-between';

// Deliveries to the north annex run on weekdays, and not on the public holiday.
const holidays = new Set(['2026-11-26']);

function toIso(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

export default function DisabledDates() {
  const [value, setValue] = useState('2026-11-18');

  return (
    <SpaceBetween size="s">
      <Box variant="h3" id="delivery-day-title">
        Delivery day
      </Box>
      <Calendar
        value={value}
        onChange={event => setValue(event.detail.value)}
        ariaLabelledby="delivery-day-title"
        isDateEnabled={date => !isWeekend(date) && !holidays.has(toIso(date))}
        dateDisabledReason={date =>
          isWeekend(date) ? 'Deliveries run on weekdays only.' : 'The yard is closed for the public holiday.'
        }
      />
      <Box color="text-body-secondary" fontSize="body-s">
        Delivery booked for {value}
      </Box>
    </SpaceBetween>
  );
}
