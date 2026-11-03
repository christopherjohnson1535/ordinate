// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useState } from 'react';

import Box from '@ordinate/components/box';
import RadioButton from '@ordinate/components/radio-button';
import SpaceBetween from '@ordinate/components/space-between';

const schedules = [
  { value: 'hourly', label: 'Hourly', description: 'Kept for 2 days.' },
  { value: 'daily', label: 'Daily', description: 'Kept for 30 days.' },
  { value: 'weekly', label: 'Weekly', description: 'Kept for a year.' },
];

export default function Standalone() {
  const [schedule, setSchedule] = useState('daily');
  const headingId = useId();

  return (
    <SpaceBetween size="s">
      <Box variant="h4" tagOverride="h3" id={headingId}>
        Backup schedule
      </Box>
      <div role="radiogroup" aria-labelledby={headingId}>
        <SpaceBetween size="xs">
          {schedules.map(option => (
            <RadioButton
              key={option.value}
              name="backup-schedule"
              value={option.value}
              checked={schedule === option.value}
              onSelect={() => setSchedule(option.value)}
              description={option.description}
            >
              {option.label}
            </RadioButton>
          ))}
        </SpaceBetween>
      </div>
    </SpaceBetween>
  );
}
