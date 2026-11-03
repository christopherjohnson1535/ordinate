// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import TitleBlock, { TitleBlockProps } from '@ordinate/components/title-block';

const items: TitleBlockProps.Item[] = [
  { label: 'Client', value: 'Harbour & Pine' },
  { label: 'Project', value: 'Hut No. 3' },
  { label: 'Drawing', value: 'Ground floor plan' },
  { label: 'Scale', value: '1:50' },
  { label: 'Date', value: '14 November 2026' },
  { label: 'Revision', value: 'C' },
];

export default function Columns() {
  const [columns, setColumns] = useState<TitleBlockProps.Columns>(3);

  return (
    <SpaceBetween size="l">
      <SegmentedControl
        label="Columns"
        selectedId={String(columns)}
        onChange={event =>
          setColumns(event.detail.selectedId === 'auto' ? 'auto' : (Number(event.detail.selectedId) as 2 | 3))
        }
        options={[
          { id: 'auto', text: 'Auto' },
          { id: '3', text: '3' },
          { id: '2', text: '2' },
        ]}
      />
      <TitleBlock ariaLabel="Drawing details" columns={columns} items={items} />
    </SpaceBetween>
  );
}
