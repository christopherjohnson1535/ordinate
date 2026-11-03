// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Calendar from '@ordinate/components/calendar';
import SpaceBetween from '@ordinate/components/space-between';

export default function Basic() {
  const [value, setValue] = useState('2026-11-14');

  return (
    <SpaceBetween size="s">
      <Calendar value={value} onChange={event => setValue(event.detail.value)} ariaLabel="Site visit" />
      <Box color="text-body-secondary" fontSize="body-s">
        Site visit on {value || 'no day yet'}
      </Box>
    </SpaceBetween>
  );
}
