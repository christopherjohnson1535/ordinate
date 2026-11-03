// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Form from '@ordinate/components/form';
import FormField from '@ordinate/components/form-field';
import Slider from '@ordinate/components/slider';

export default function ReferenceValues() {
  const [memory, setMemory] = useState(32);
  const [nodes, setNodes] = useState(6);

  return (
    <Form>
      <FormField label="Memory per node" description="16 GiB is the default; above 48 GiB needs approval.">
        <Slider
          value={memory}
          onChange={event => setMemory(event.detail.value)}
          min={0}
          max={64}
          step={4}
          referenceValues={[16, 48]}
          valueFormatter={value => `${value} GiB`}
        />
      </FormField>
      <FormField label="Nodes" description="Each node costs about $41 a month.">
        <Slider
          value={nodes}
          onChange={event => setNodes(event.detail.value)}
          min={1}
          max={12}
          tickMarks={true}
          ariaDescription="Each node costs about 41 dollars a month."
        />
      </FormField>
    </Form>
  );
}
