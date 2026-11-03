// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import DateRangePicker, { DateRangePickerProps } from '@ordinate/components/date-range-picker';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';

const relativeOptions: DateRangePickerProps.RelativeOption[] = [
  { key: 'previous-15-minutes', amount: 15, unit: 'minute', type: 'relative' },
  { key: 'previous-1-hour', amount: 1, unit: 'hour', type: 'relative' },
  { key: 'previous-6-hours', amount: 6, unit: 'hour', type: 'relative' },
  { key: 'previous-24-hours', amount: 24, unit: 'hour', type: 'relative' },
];

export default function Relative() {
  const [value, setValue] = useState<DateRangePickerProps.Value | null>({
    type: 'relative',
    key: 'previous-6-hours',
    amount: 6,
    unit: 'hour',
  });

  return (
    <SpaceBetween size="s">
      <FormField label="Log window" description="Events from us-mountain-1.">
        <DateRangePicker
          value={value}
          onChange={event => setValue(event.detail.value)}
          relativeOptions={relativeOptions}
          placeholder="Filter by a date and time range"
          expandToViewport={true}
        />
      </FormField>
      <Box variant="code">{JSON.stringify(value)}</Box>
    </SpaceBetween>
  );
}
