// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AttributeEditor from '@ordinate/components/attribute-editor';
import Input from '@ordinate/components/input';

interface Header {
  name: string;
  value: string;
}

export default function Empty() {
  const [items, setItems] = useState<Header[]>([]);

  const update = (index: number, change: Partial<Header>) =>
    setItems(current => current.map((item, i) => (i === index ? { ...item, ...change } : item)));

  return (
    <AttributeEditor<Header>
      items={items}
      addButtonText="Add header"
      empty="survey-api sends no extra headers."
      i18nStrings={{ itemRemovedAriaLive: 'Header removed' }}
      onAddButtonClick={() => setItems(current => [...current, { name: '', value: '' }])}
      onRemoveButtonClick={event => setItems(current => current.filter((_, i) => i !== event.detail.itemIndex))}
      definition={[
        {
          label: 'Header',
          control: (item, index) => (
            <Input
              value={item.name}
              placeholder="X-Request-Source"
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
