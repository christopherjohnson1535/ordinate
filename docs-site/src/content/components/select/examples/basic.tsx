// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Select, { SelectProps } from '@ordinate/components/select';

const zones: SelectProps.Options = [
  { value: 'us-mountain-1a', label: 'us-mountain-1a', description: 'Denver', labelTag: '14 nodes' },
  { value: 'us-mountain-1b', label: 'us-mountain-1b', description: 'Denver', labelTag: '9 nodes' },
  { value: 'us-mountain-1c', label: 'us-mountain-1c', description: 'Salt Lake City', labelTag: '3 nodes' },
  { value: 'us-coast-2a', label: 'us-coast-2a', description: 'Portland', labelTag: '11 nodes' },
];

export default function Basic() {
  const [zone, setZone] = useState<SelectProps.Option | null>(null);

  return (
    <FormField label="Zone" description="Where the new node for atrium-api starts.">
      <Select
        selectedOption={zone}
        onChange={event => setZone(event.detail.selectedOption)}
        options={zones}
        placeholder="Choose a zone"
      />
    </FormField>
  );
}
