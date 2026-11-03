// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import DateRangePicker, { DateRangePickerProps } from '@ordinate/components/date-range-picker';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';

const isWeekday = (date: Date) => date.getDay() !== 0 && date.getDay() !== 6;

export default function DateOnly() {
  const [value, setValue] = useState<DateRangePickerProps.Value | null>({
    type: 'absolute',
    startDate: '2026-11-16',
    endDate: '2026-11-20',
  });

  return (
    <SpaceBetween size="s">
      <FormField label="Crane hire" description="The crane is hired by the working day.">
        <DateRangePicker
          value={value}
          onChange={event => setValue(event.detail.value)}
          dateOnly={true}
          rangeSelectorMode="absolute-only"
          isDateEnabled={isWeekday}
          dateDisabledReason={() => 'The crane is not hired out at weekends.'}
          placeholder="Choose a date range"
        />
      </FormField>
      <Box variant="code">{JSON.stringify(value)}</Box>
    </SpaceBetween>
  );
}
