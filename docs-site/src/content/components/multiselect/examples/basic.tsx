// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Multiselect, { MultiselectProps } from '@ordinate/components/multiselect';

const zones: MultiselectProps.Options = [
  { value: 'us-mountain-1a', label: 'us-mountain-1a', description: 'Denver' },
  { value: 'us-mountain-1b', label: 'us-mountain-1b', description: 'Denver' },
  { value: 'us-coast-2a', label: 'us-coast-2a', description: 'Portland' },
  { value: 'eu-north-1a', label: 'eu-north-1a', description: 'Stockholm', labelTag: 'GPU' },
];

export default function Basic() {
  const [selected, setSelected] = useState<ReadonlyArray<MultiselectProps.Option>>([zones[0], zones[2]]);

  return (
    <FormField label="Zones" description="survey-api runs a node in each zone you choose.">
      <Multiselect
        options={zones}
        selectedOptions={selected}
        placeholder="Choose zones"
        deselectAriaLabel={option => `Remove ${option.label}`}
        onChange={event => setSelected(event.detail.selectedOptions)}
      />
    </FormField>
  );
}
