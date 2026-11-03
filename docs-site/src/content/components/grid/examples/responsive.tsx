// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Container from '@ordinate/components/container';
import Grid from '@ordinate/components/grid';
import StatusIndicator from '@ordinate/components/status-indicator';

export default function Responsive() {
  return (
    <Grid gridDefinition={[{ colspan: { default: 12, xs: 8 } }, { colspan: { default: 12, xs: 4 } }]}>
      <Container kind="resource" reference="R1" heading="Deploys this week" measure="12 deploys">
        <Box variant="p">
          Eleven deploys finished without a rollback. The deploy of store:v12 on Tuesday was rolled back after the
          health checks of vault-store failed.
        </Box>
      </Container>
      <Container kind="resource" reference="R2" heading="Health">
        <StatusIndicator state="caution">1 service degraded</StatusIndicator>
      </Container>
    </Grid>
  );
}
