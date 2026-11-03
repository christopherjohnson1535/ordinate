// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import KeyValuePairs, { KeyValuePairsProps } from '@ordinate/components/key-value-pairs';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';

const items: KeyValuePairsProps.Pair[] = [
  { label: 'Project', value: 'north-annex' },
  { label: 'Region', value: 'us-mountain-1' },
  { label: 'Nodes', value: '12' },
  { label: 'Owner', value: 'Dana Ruiz' },
  { label: 'Cost centre', value: '4410' },
  { label: 'Created', value: '3 March 2025' },
  { label: 'Plan', value: 'Reserved, 1 year' },
  { label: 'Support', value: 'Business hours' },
];

export default function Columns() {
  const [columns, setColumns] = useState<KeyValuePairsProps.Columns>(4);

  return (
    <SpaceBetween size="l">
      <SegmentedControl
        label="Columns"
        selectedId={String(columns)}
        onChange={event => setColumns(Number(event.detail.selectedId) as KeyValuePairsProps.Columns)}
        options={[1, 2, 3, 4].map(n => ({ id: String(n), text: String(n) }))}
      />
      <KeyValuePairs columns={columns} items={items} ariaLabel="Project summary" />
    </SpaceBetween>
  );
}
