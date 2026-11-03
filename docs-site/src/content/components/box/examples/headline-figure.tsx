// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import ColumnLayout from '@ordinate/components/column-layout';

export default function HeadlineFigure() {
  return (
    <ColumnLayout columns={3} variant="text-grid">
      <div>
        <Box variant="key-label">Running nodes</Box>
        <Box variant="value-large">12</Box>
      </div>
      <div>
        <Box variant="key-label">Storage used</Box>
        <Box variant="value-large">1.4 TB</Box>
      </div>
      <div>
        <Box variant="key-label">Open alarms</Box>
        <Box variant="value-large">3</Box>
        <Box color="text-status-warning" fontSize="body-s">
          2 more than yesterday
        </Box>
      </div>
    </ColumnLayout>
  );
}
