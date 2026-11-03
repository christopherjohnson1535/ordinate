// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ControlGroup from '@ordinate/components/control-group';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import Select, { SelectProps } from '@ordinate/components/select';

const units: SelectProps.Options = [
  { value: 'GiB', label: 'GiB' },
  { value: 'TiB', label: 'TiB' },
];

export default function ValueAndUnit() {
  const [size, setSize] = useState('500');
  const [unit, setUnit] = useState<SelectProps.Option | null>(units[0]);

  return (
    <FormField label="Volume size" description="Storage for drawings-store.">
      <ControlGroup>
        <Input type="number" inputMode="numeric" value={size} onChange={event => setSize(event.detail.value)} />
        <Select
          options={units}
          selectedOption={unit}
          ariaLabel="Size unit"
          onChange={event => setUnit(event.detail.selectedOption)}
        />
      </ControlGroup>
    </FormField>
  );
}
