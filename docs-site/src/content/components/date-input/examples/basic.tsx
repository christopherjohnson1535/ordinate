// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import DateInput from '@ordinate/components/date-input';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';

export default function Basic() {
  const [value, setValue] = useState('2026-11-14');

  return (
    <SpaceBetween size="s">
      <FormField label="Tender closes" constraintText="Use YYYY/MM/DD.">
        <DateInput value={value} onChange={event => setValue(event.detail.value)} placeholder="YYYY/MM/DD" />
      </FormField>
      <Box color="text-body-secondary" fontSize="body-s">
        Value: “{value}”
      </Box>
    </SpaceBetween>
  );
}
