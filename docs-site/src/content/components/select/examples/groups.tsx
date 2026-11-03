// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Select, { SelectProps } from '@ordinate/components/select';

const resources: SelectProps.Options = [
  {
    label: 'Compute',
    options: [
      { value: 'node', label: 'Node', iconName: 'grid-view', description: 'A virtual machine in one zone.' },
      { value: 'job', label: 'Scheduled job', iconName: 'history', description: 'Runs a script on a timetable.' },
    ],
  },
  {
    label: 'Storage',
    description: 'Not available on the free plan.',
    disabled: true,
    options: [
      { value: 'volume', label: 'Block volume', iconName: 'folder' },
      { value: 'bucket', label: 'Object bucket', iconName: 'folder-open' },
    ],
  },
  {
    label: 'Network',
    options: [
      { value: 'gateway', label: 'Gateway', iconName: 'globe', tags: ['Public', 'IPv6'] },
      { value: 'tunnel', label: 'Private tunnel', iconName: 'locked', tags: ['Private'] },
    ],
  },
];

export default function Groups() {
  const [resource, setResource] = useState<SelectProps.Option | null>(null);

  return (
    <FormField label="Resource type">
      <Select
        selectedOption={resource}
        onChange={event => setResource(event.detail.selectedOption)}
        options={resources}
        placeholder="Choose a resource type"
      />
    </FormField>
  );
}
