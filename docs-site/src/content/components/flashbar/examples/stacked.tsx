// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import Flashbar, { FlashbarProps } from '@ordinate/components/flashbar';
import SpaceBetween from '@ordinate/components/space-between';

interface Entry {
  id: string;
  type: FlashbarProps.Type;
  loading?: boolean;
  header: string;
}

const samples: Record<'fault' | 'caution' | 'complete' | 'underway', Omit<Entry, 'id'>> = {
  fault: { type: 'fault', header: 'gallery-east failed to start' },
  caution: { type: 'caution', header: 'Disk on north-annex-07 is 92% full' },
  complete: { type: 'complete', header: 'Snapshot vol-0a4e created' },
  underway: { type: 'note', loading: true, header: 'Rolling out web:v2' },
};

let nextId = 0;
const make = (sample: keyof typeof samples): Entry => ({ id: `n-${nextId++}`, ...samples[sample] });

export default function Stacked() {
  const [entries, setEntries] = useState<Entry[]>(() => [
    make('fault'),
    make('underway'),
    make('caution'),
    make('complete'),
  ]);

  const items: FlashbarProps.MessageDefinition[] = entries.map(entry => ({
    ...entry,
    dismissible: true,
    onDismiss: () => setEntries(current => current.filter(other => other.id !== entry.id)),
  }));

  return (
    <SpaceBetween size="s">
      <SpaceBetween direction="horizontal" size="xs">
        {(Object.keys(samples) as Array<keyof typeof samples>).map(sample => (
          <Button key={sample} onClick={() => setEntries(current => [make(sample), ...current])}>
            Add {sample}
          </Button>
        ))}
      </SpaceBetween>
      <Flashbar items={items} stackItems={true} />
    </SpaceBetween>
  );
}
