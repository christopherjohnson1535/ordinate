// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';
import TimeInput from '@ordinate/components/time-input';

export default function Basic() {
  const [value, setValue] = useState('09:30');

  return (
    <SpaceBetween size="s">
      <FormField label="Drop-off time" constraintText="24-hour clock, hh:mm.">
        <TimeInput value={value} onChange={event => setValue(event.detail.value)} format="hh:mm" placeholder="hh:mm" />
      </FormField>
      <Box color="text-body-secondary" fontSize="body-s">
        Value: “{value}”
      </Box>
    </SpaceBetween>
  );
}
