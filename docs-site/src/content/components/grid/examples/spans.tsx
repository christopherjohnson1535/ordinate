// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Grid from '@ordinate/components/grid';

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <Box padding="s" variant="code" textAlign="center">
      {children}
    </Box>
  );
}

export default function Spans() {
  return (
    <Grid
      gridDefinition={[
        { colspan: 8 },
        { colspan: 4 },
        { colspan: 4 },
        { colspan: 4 },
        { colspan: 4 },
        { colspan: 6, offset: 3 },
        { colspan: 3 },
        { colspan: 9 },
      ]}
    >
      <Cell>Plan, 8</Cell>
      <Cell>Key, 4</Cell>
      <Cell>Section A, 4</Cell>
      <Cell>Section B, 4</Cell>
      <Cell>Section C, 4</Cell>
      <Cell>Elevation, 6 after 3</Cell>
      <Cell>Notes, 3</Cell>
      <Cell>Schedule, 9</Cell>
    </Grid>
  );
}
