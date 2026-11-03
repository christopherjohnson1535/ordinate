// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import DateRangePicker, { DateRangePickerProps } from '@ordinate/components/date-range-picker';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';

export default function Absolute() {
  const [value, setValue] = useState<DateRangePickerProps.Value | null>({
    type: 'absolute',
    startDate: '2026-11-09T07:30:00',
    endDate: '2026-11-13T18:00:00',
  });

  return (
    <SpaceBetween size="s">
      <FormField label="Site access" description="When contractors may enter the north annex.">
        <DateRangePicker
          value={value}
          onChange={event => setValue(event.detail.value)}
          rangeSelectorMode="absolute-only"
          timeInputFormat="hh:mm"
          placeholder="Choose the start and end"
        />
      </FormField>
      <Box variant="code">{JSON.stringify(value)}</Box>
    </SpaceBetween>
  );
}
