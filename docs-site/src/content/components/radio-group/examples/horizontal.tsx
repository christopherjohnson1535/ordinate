// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import RadioGroup from '@ordinate/components/radio-group';

export default function Horizontal() {
  const [size, setSize] = useState<string | null>('a1');

  return (
    <FormField label="Sheet size" constraintText={`Plots of north-annex print on ${size?.toUpperCase()}.`}>
      <RadioGroup
        value={size}
        onChange={event => setSize(event.detail.value)}
        direction="horizontal"
        items={[
          { value: 'a0', label: 'A0' },
          { value: 'a1', label: 'A1' },
          { value: 'a2', label: 'A2' },
          { value: 'a3', label: 'A3' },
        ]}
      />
    </FormField>
  );
}
