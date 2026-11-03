// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Select, { SelectProps } from '@ordinate/components/select';

const zones = ['1a', '1b', '1c'];

const nodes: SelectProps.Options = Array.from({ length: 36 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  const zone = `us-mountain-${zones[index % zones.length]}`;
  return {
    value: `north-annex-${number}`,
    label: `north-annex-${number}`,
    description: zone,
    filteringTags: [index % 4 === 0 ? 'gpu' : 'general'],
  };
});

export default function Filtering() {
  const [node, setNode] = useState<SelectProps.Option | null>(null);

  return (
    <FormField label="Node" description="Type part of a name or a zone, or gpu.">
      <Select
        selectedOption={node}
        onChange={event => setNode(event.detail.selectedOption)}
        options={nodes}
        placeholder="Choose a node"
        filteringType="auto"
        filteringPlaceholder="Find a node"
        filteringAriaLabel="Find a node"
        noMatch="No nodes match."
      />
    </FormField>
  );
}
