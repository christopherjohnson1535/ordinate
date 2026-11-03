// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import DateInput from '@ordinate/components/date-input';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';

export default function Month() {
  const [value, setValue] = useState('2028-07');

  return (
    <SpaceBetween size="s">
      <FormField label="Certificate expires" constraintText="Use YYYY/MM.">
        <DateInput
          granularity="month"
          value={value}
          onChange={event => setValue(event.detail.value)}
          placeholder="YYYY/MM"
        />
      </FormField>
      <Box color="text-body-secondary" fontSize="body-s">
        Value: “{value}”
      </Box>
    </SpaceBetween>
  );
}
