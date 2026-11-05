// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import RadioButton from '@ordinate/components/radio-button';
import SpaceBetween from '@ordinate/components/space-between';

const schedules = [
  { value: 'hourly', label: 'Hourly', description: 'Kept for 2 days.' },
  { value: 'daily', label: 'Daily', description: 'Kept for 30 days.' },
  { value: 'weekly', label: 'Weekly', description: 'Kept for a year.' },
];

export default function Standalone() {
  const [schedule, setSchedule] = useState('daily');

  return (
    <FormField label="Backup schedule">
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
    </FormField>
  );
}
