// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import ColumnLayout, { ColumnLayoutProps } from '@ordinate/components/column-layout';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';

const facts = [
  ['Instance type', 'm5.large'],
  ['Zone', 'us-mountain-1a'],
  ['State', 'Running'],
  ['Launched', '31 October 2026'],
  ['Private address', '10.0.4.12'],
  ['Image', 'base-2026.10'],
];

export default function Borders() {
  const [borders, setBorders] = useState<ColumnLayoutProps.Borders>('vertical');

  return (
    <SpaceBetween size="l">
      <SegmentedControl
        label="Borders"
        selectedId={borders}
        onChange={event => setBorders(event.detail.selectedId as ColumnLayoutProps.Borders)}
        options={[
          { id: 'none', text: 'None' },
          { id: 'vertical', text: 'Vertical' },
          { id: 'horizontal', text: 'Horizontal' },
          { id: 'all', text: 'All' },
        ]}
      />
      <ColumnLayout columns={3} borders={borders}>
        {facts.map(([label, value]) => (
          <div key={label}>
            <Box variant="key-label">{label}</Box>
            <div>{value}</div>
          </div>
        ))}
      </ColumnLayout>
    </SpaceBetween>
  );
}
