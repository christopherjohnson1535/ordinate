// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AttributeEditor from '@ordinate/components/attribute-editor';
import Input from '@ordinate/components/input';
import Select, { SelectProps } from '@ordinate/components/select';

interface PortRule {
  protocol: SelectProps.Option | null;
  port: string;
  description: string;
}

const protocols: SelectProps.Options = [
  { value: 'tcp', label: 'TCP' },
  { value: 'udp', label: 'UDP' },
];

export default function GridLayout() {
  const [items, setItems] = useState<PortRule[]>([
    { protocol: protocols[0], port: '443', description: 'Public HTTPS for north-annex-web' },
    { protocol: protocols[1], port: '53', description: 'DNS' },
  ]);

  const update = (index: number, change: Partial<PortRule>) =>
    setItems(current => current.map((item, i) => (i === index ? { ...item, ...change } : item)));

  return (
    <AttributeEditor<PortRule>
      items={items}
      addButtonText="Add rule"
      removeButtonAriaLabel={item => `Remove rule for port ${item.port}`}
      onAddButtonClick={() => setItems(current => [...current, { protocol: null, port: '', description: '' }])}
      onRemoveButtonClick={event => setItems(current => current.filter((_, i) => i !== event.detail.itemIndex))}
      gridLayout={[
        { rows: [[1, 1], [1]], removeButton: { ownRow: true } },
        { breakpoint: 'xxs', rows: [[1, 1, 3]] },
      ]}
      definition={[
        {
          label: 'Protocol',
          control: (item, index) => (
            <Select
              options={protocols}
              selectedOption={item.protocol}
              placeholder="Choose"
              onChange={event => update(index, { protocol: event.detail.selectedOption })}
            />
          ),
        },
        {
          label: 'Port',
          control: (item, index) => (
            <Input
              inputMode="numeric"
              value={item.port}
              onChange={event => update(index, { port: event.detail.value })}
            />
          ),
          errorText: item => (item.port === '' || /^\d+$/.test(item.port) ? undefined : 'Enter a number.'),
        },
        {
          label: 'Description',
          control: (item, index) => (
            <Input value={item.description} onChange={event => update(index, { description: event.detail.value })} />
          ),
        },
      ]}
    />
  );
}
