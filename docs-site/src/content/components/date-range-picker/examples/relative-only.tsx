// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import DateRangePicker, { DateRangePickerProps } from '@ordinate/components/date-range-picker';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';

const relativeOptions: DateRangePickerProps.RelativeOption[] = [
  { key: 'previous-5-minutes', amount: 5, unit: 'minute', type: 'relative' },
  { key: 'previous-30-minutes', amount: 30, unit: 'minute', type: 'relative' },
  { key: 'previous-3-hours', amount: 3, unit: 'hour', type: 'relative' },
];

export default function RelativeOnly() {
  const [value, setValue] = useState<DateRangePickerProps.Value | null>({
    type: 'relative',
    key: 'previous-30-minutes',
    amount: 30,
    unit: 'minute',
  });

  return (
    <SpaceBetween size="s">
      <FormField label="Alarm looks back over" description="The window the latency alarm averages.">
        <DateRangePicker
          value={value}
          onChange={event => setValue(event.detail.value)}
          relativeOptions={relativeOptions}
          rangeSelectorMode="relative-only"
          showClearButton={false}
          expandToViewport={true}
        />
      </FormField>
      <Box color="text-body-secondary" fontSize="body-s">
        {value?.type === 'relative'
          ? `Averaging the last ${value.amount} ${value.unit}${value.amount === 1 ? '' : 's'} of samples.`
          : 'No window set.'}
      </Box>
    </SpaceBetween>
  );
}
