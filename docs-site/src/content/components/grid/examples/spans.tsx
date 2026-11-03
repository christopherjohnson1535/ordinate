// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Container from '@ordinate/components/container';
import Grid from '@ordinate/components/grid';

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
      ]}
    >
      <Container>Plan, 8</Container>
      <Container>Key, 4</Container>
      <Container>Section A, 4</Container>
      <Container>Section B, 4</Container>
      <Container>Section C, 4</Container>
      <Container>Elevation, 6 after 3</Container>
      <Container>Notes, 3</Container>
    </Grid>
  );
}
