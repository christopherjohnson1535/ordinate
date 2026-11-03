// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import DatePicker from '@ordinate/components/date-picker';
import FormField from '@ordinate/components/form-field';

const isMonday = (date: Date) => date.getDay() === 1;

// The calendar hatches Mondays; a typed Monday is caught here.
function check(value: string): string | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return undefined;
  }
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return isMonday(date) ? 'The workshop is closed on Mondays. Choose another day.' : undefined;
}

export default function DisabledDates() {
  const [value, setValue] = useState('2026-11-17');

  return (
    <FormField
      label="Collection date"
      description="Pick up the north annex samples from the workshop."
      constraintText="Use YYYY/MM/DD."
      errorText={check(value)}
    >
      <DatePicker
        value={value}
        onChange={event => setValue(event.detail.value)}
        placeholder="YYYY/MM/DD"
        isDateEnabled={date => !isMonday(date)}
        dateDisabledReason={() => 'The workshop is closed on Mondays.'}
        expandToViewport={true}
      />
    </FormField>
  );
}
