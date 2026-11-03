// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import DateInput from '@ordinate/components/date-input';
import FormField from '@ordinate/components/form-field';

const isComplete = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

// The value is checked when the user leaves the field, not while they type.
function check(value: string): string | undefined {
  if (value === '') {
    return 'Enter the date the lease starts.';
  }
  if (!isComplete(value)) {
    return 'Enter a whole date: year, month and day.';
  }
  if (value < '2026-01-01') {
    return 'The lease cannot start before 2026.';
  }
  return undefined;
}

export default function Validation() {
  const [value, setValue] = useState('2025-12');
  const [errorText, setErrorText] = useState<string | undefined>();

  return (
    <FormField
      label="Lease starts"
      description="The first day the north annex is in your name."
      constraintText="Use YYYY/MM/DD."
      errorText={errorText}
    >
      <DateInput
        value={value}
        placeholder="YYYY/MM/DD"
        ariaRequired={true}
        onChange={event => {
          setValue(event.detail.value);
          if (errorText && check(event.detail.value) === undefined) {
            setErrorText(undefined);
          }
        }}
        onBlur={() => setErrorText(check(value))}
      />
    </FormField>
  );
}
