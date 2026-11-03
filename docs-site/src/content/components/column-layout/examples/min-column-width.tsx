// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import ColumnLayout from '@ordinate/components/column-layout';

const regions = [
  ['us-mountain-1', '20 nodes'],
  ['us-coast-2', '12 nodes'],
  ['eu-harbour-1', '8 nodes'],
  ['eu-north-1', '6 nodes'],
  ['ap-south-1', '4 nodes'],
  ['ap-east-2', '2 nodes'],
];

export default function MinColumnWidth() {
  return (
    <ColumnLayout columns={4} minColumnWidth={160} borders="vertical">
      {regions.map(([region, nodes]) => (
        <div key={region}>
          <Box variant="strong">{region}</Box>
          <Box color="text-body-secondary">{nodes}</Box>
        </div>
      ))}
    </ColumnLayout>
  );
}
