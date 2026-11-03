// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import Slider from '@ordinate/components/slider';

const min = 1;
const max = 30;

export default function WithInput() {
  const [days, setDays] = useState(14);
  const [text, setText] = useState('14');

  const outOfRange = Number(text) < min || Number(text) > max || text.trim() === '';

  return (
    <FormField
      label="Keep snapshots for"
      description="Days, from 1 to 30."
      errorText={outOfRange ? `Enter a number of days from ${min} to ${max}.` : undefined}
      secondaryControl={
        <Input
          type="number"
          inputMode="numeric"
          value={text}
          ariaLabel="Days"
          onChange={event => {
            setText(event.detail.value);
            const number = Number(event.detail.value);
            if (event.detail.value.trim() !== '' && number >= min && number <= max) {
              setDays(Math.round(number));
            }
          }}
        />
      }
    >
      <Slider
        value={days}
        onChange={event => {
          setDays(event.detail.value);
          setText(String(event.detail.value));
        }}
        min={min}
        max={max}
        referenceValues={[7, 14]}
        valueFormatter={value => (value === 1 ? '1 day' : `${value} days`)}
      />
    </FormField>
  );
}
