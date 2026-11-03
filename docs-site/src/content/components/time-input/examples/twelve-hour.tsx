// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import FormField from '@ordinate/components/form-field';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import TimeInput from '@ordinate/components/time-input';

export default function TwelveHour() {
  const [time, setTime] = useState('04:30');
  const [half, setHalf] = useState('pm');

  return (
    <SpaceBetween size="s">
      <FormField
        label="Pick-up time"
        constraintText="12-hour clock, hh:mm."
        secondaryControl={
          <SegmentedControl
            label="Half of the day"
            selectedId={half}
            onChange={event => setHalf(event.detail.selectedId)}
            options={[
              { id: 'am', text: 'AM' },
              { id: 'pm', text: 'PM' },
            ]}
          />
        }
      >
        <TimeInput
          value={time}
          onChange={event => setTime(event.detail.value)}
          format="hh:mm"
          use24Hour={false}
          placeholder="hh:mm"
        />
      </FormField>
      <Box color="text-body-secondary" fontSize="body-s">
        Collect at {time || '--:--'} {half.toUpperCase()}
      </Box>
    </SpaceBetween>
  );
}
