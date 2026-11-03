// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ControlGroup from '@ordinate/components/control-group';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import Select, { SelectProps } from '@ordinate/components/select';

const units: SelectProps.Options = [
  { value: 'minutes', label: 'minutes' },
  { value: 'hours', label: 'hours' },
];

export default function Validation() {
  const [amount, setAmount] = useState('0');
  const [unit, setUnit] = useState<SelectProps.Option | null>(units[0]);
  const valid = Number(amount) > 0;

  return (
    <FormField
      label="Snapshot interval"
      description="How often survey-api writes a snapshot."
      errorText={valid ? undefined : 'Enter an interval greater than zero.'}
    >
      <ControlGroup>
        <Input type="number" inputMode="numeric" value={amount} onChange={event => setAmount(event.detail.value)} />
        <Select
          options={units}
          selectedOption={unit}
          ariaLabel="Interval unit"
          onChange={event => setUnit(event.detail.selectedOption)}
        />
      </ControlGroup>
    </FormField>
  );
}
