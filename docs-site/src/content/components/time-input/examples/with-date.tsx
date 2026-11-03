// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import ColumnLayout from '@ordinate/components/column-layout';
import DatePicker from '@ordinate/components/date-picker';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';
import TimeInput from '@ordinate/components/time-input';

const isCompleteDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const isCompleteTime = (value: string) => /^\d{2}:\d{2}$/.test(value);

export default function WithDate() {
  const [date, setDate] = useState('2026-11-21');
  const [time, setTime] = useState('02:00');
  const complete = isCompleteDate(date) && isCompleteTime(time);

  return (
    <SpaceBetween size="m">
      <ColumnLayout columns={2}>
        <FormField label="Maintenance date" constraintText="YYYY/MM/DD." layout="stacked">
          <DatePicker value={date} onChange={event => setDate(event.detail.value)} placeholder="YYYY/MM/DD" />
        </FormField>
        <FormField label="Start time" constraintText="24-hour clock, UTC." layout="stacked">
          <TimeInput value={time} onChange={event => setTime(event.detail.value)} format="hh:mm" placeholder="hh:mm" />
        </FormField>
      </ColumnLayout>
      <Box color="text-body-secondary" fontSize="body-s">
        {complete ? `us-mountain-1 goes read-only at ${date}T${time}:00Z.` : 'Enter a whole date and time.'}
      </Box>
    </SpaceBetween>
  );
}
