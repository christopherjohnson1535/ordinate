// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import DatePicker from '@ordinate/components/date-picker';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';

export default function Month() {
  const [value, setValue] = useState('2026-10');

  return (
    <SpaceBetween size="s">
      <FormField label="Report month" constraintText="Use YYYY/MM.">
        <DatePicker
          granularity="month"
          value={value}
          onChange={event => setValue(event.detail.value)}
          placeholder="YYYY/MM"
        />
      </FormField>
      <Box color="text-body-secondary" fontSize="body-s">
        Usage report for {value || 'no month yet'}
      </Box>
    </SpaceBetween>
  );
}
