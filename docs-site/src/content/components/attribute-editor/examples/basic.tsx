// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AttributeEditor from '@ordinate/components/attribute-editor';
import Input from '@ordinate/components/input';

interface Variable {
  name: string;
  value: string;
}

export default function Basic() {
  const [items, setItems] = useState<Variable[]>([
    { name: 'REGION', value: 'us-mountain-1' },
    { name: 'LOG_LEVEL', value: 'info' },
  ]);

  const update = (index: number, change: Partial<Variable>) =>
    setItems(current => current.map((item, i) => (i === index ? { ...item, ...change } : item)));

  return (
    <AttributeEditor<Variable>
      items={items}
      addButtonText="Add variable"
      removeButtonAriaLabel={item => `Remove variable ${item.name}`}
      empty="No environment variables."
      onAddButtonClick={() => setItems(current => [...current, { name: '', value: '' }])}
      onRemoveButtonClick={event => setItems(current => current.filter((_, i) => i !== event.detail.itemIndex))}
      definition={[
        {
          label: 'Name',
          control: (item, index) => (
            <Input
              value={item.name}
              placeholder="VARIABLE_NAME"
              disableBrowserAutocorrect={true}
              onChange={event => update(index, { name: event.detail.value })}
            />
          ),
        },
        {
          label: 'Value',
          control: (item, index) => (
            <Input value={item.value} onChange={event => update(index, { value: event.detail.value })} />
          ),
        },
      ]}
    />
  );
}
