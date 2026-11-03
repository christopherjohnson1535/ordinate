// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import ColumnLayout from '@ordinate/components/column-layout';
import Container from '@ordinate/components/container';

export default function TextGrid() {
  return (
    <Container heading="Repair queue" kind="resource" reference="R1">
      <ColumnLayout columns={3} variant="text-grid">
        <div>
          <Box variant="key-label">Open</Box>
          <Box variant="value-large">14</Box>
        </div>
        <div>
          <Box variant="key-label">Due today</Box>
          <Box variant="value-large">3</Box>
        </div>
        <div>
          <Box variant="key-label">Waiting on parts</Box>
          <Box variant="value-large">2</Box>
        </div>
      </ColumnLayout>
    </Container>
  );
}
