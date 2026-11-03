// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Checkbox from '@ordinate/components/checkbox';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';

const events = [
  { id: 'deploy', label: 'Deploy finished', description: 'Each time a service rolls out.' },
  { id: 'failure', label: 'Health check failed', description: 'When a node stops answering.' },
  { id: 'budget', label: 'Budget reached', description: 'When north-annex passes 80% of its budget.' },
];

export default function Group() {
  const [selected, setSelected] = useState<string[]>(['failure']);

  return (
    <FormField label="Send alerts for" description="Alerts go to Dana Ruiz and the on-call rota.">
      <SpaceBetween size="xs">
        {events.map(item => (
          <Checkbox
            key={item.id}
            // Each checkbox needs its own ID; otherwise they all take the field's.
            controlId={`alert-${item.id}`}
            checked={selected.includes(item.id)}
            description={item.description}
            onChange={event =>
              setSelected(event.detail.checked ? [...selected, item.id] : selected.filter(value => value !== item.id))
            }
          >
            {item.label}
          </Checkbox>
        ))}
      </SpaceBetween>
    </FormField>
  );
}
