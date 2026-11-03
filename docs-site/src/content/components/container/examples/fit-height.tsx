// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Container from '@ordinate/components/container';
import Grid from '@ordinate/components/grid';
import Link from '@ordinate/components/link';
import StatusIndicator from '@ordinate/components/status-indicator';

export default function FitHeight() {
  return (
    <Grid gridDefinition={[{ colspan: { default: 12, xxs: 6 } }, { colspan: { default: 12, xxs: 6 } }]}>
      <Container
        fitHeight={true}
        kind="resource"
        reference="R3"
        heading="Health"
        footer={<Link href="#/components/container">Open the checks</Link>}
      >
        <StatusIndicator state="complete">All 20 nodes passed</StatusIndicator>
      </Container>
      <Container
        fitHeight={true}
        kind="neutral"
        reference="N2"
        heading="Recent events"
        footer={<Link href="#/components/container">Open the log</Link>}
      >
        <Box variant="p">09:14 Deploy of web:v2 finished in zone 1c.</Box>
        <Box variant="p">09:02 Deploy of web:v2 finished in zone 1b.</Box>
        <Box variant="p">08:51 Deploy of web:v2 finished in zone 1a.</Box>
        <Box variant="p">08:47 Dana Ruiz started a deploy of web:v2.</Box>
      </Container>
    </Grid>
  );
}
