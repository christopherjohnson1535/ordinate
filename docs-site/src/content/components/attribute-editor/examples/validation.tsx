// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AttributeEditor from '@ordinate/components/attribute-editor';
import Input from '@ordinate/components/input';

interface Tag {
  key: string;
  value: string;
  managed?: boolean;
}

const limit = 5;

export default function Validation() {
  const [items, setItems] = useState<Tag[]>([
    { key: 'project', value: 'north-annex', managed: true },
    { key: 'Cost centre', value: 'annex-04' },
    { key: 'callback', value: 'http://hooks.example.com/annex' },
  ]);

  const update = (index: number, change: Partial<Tag>) =>
    setItems(current => current.map((item, i) => (i === index ? { ...item, ...change } : item)));
  const left = limit - items.length;

  return (
    <AttributeEditor<Tag>
      items={items}
      addButtonText="Add tag"
      removeButtonAriaLabel={item => `Remove tag ${item.key}`}
      isItemRemovable={item => !item.managed}
      disableAddButton={left <= 0}
      additionalInfo={left > 0 ? `You can add ${left} more tags.` : `You have reached the limit of ${limit} tags.`}
      onAddButtonClick={() => setItems(current => [...current, { key: '', value: '' }])}
      onRemoveButtonClick={event => setItems(current => current.filter((_, i) => i !== event.detail.itemIndex))}
      definition={[
        {
          label: 'Key',
          control: (item, index) => (
            <Input
              value={item.key}
              readOnly={item.managed}
              onChange={event => update(index, { key: event.detail.value })}
            />
          ),
          errorText: item =>
            /^[a-z0-9-]*$/.test(item.key) ? undefined : 'Use lowercase letters, numbers and hyphens.',
          constraintText: item => (item.managed ? 'Set by the project.' : undefined),
        },
        {
          label: 'Value',
          control: (item, index) => (
            <Input value={item.value} onChange={event => update(index, { value: event.detail.value })} />
          ),
          warningText: item => (item.value.startsWith('http://') ? 'Prefer https:// for links.' : undefined),
        },
      ]}
    />
  );
}
