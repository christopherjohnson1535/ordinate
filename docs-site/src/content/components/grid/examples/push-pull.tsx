// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Container from '@ordinate/components/container';
import Grid from '@ordinate/components/grid';
import Header from '@ordinate/components/header';

export default function PushPull() {
  return (
    <Grid
      gridDefinition={[
        { colspan: { default: 12, xs: 8 }, push: { xs: 4 } },
        { colspan: { default: 12, xs: 4 }, pull: { xs: 8 } },
      ]}
    >
      <Container heading="Ticket 2041">
        <Box variant="p">Town bike, rear brake. Pads worn to the metal; quote sent at 9:40.</Box>
      </Container>
      <Header variant="h3" description="Comes first when the layout is narrow, sits to the side when it is wide.">
        Next in the queue
      </Header>
    </Grid>
  );
}
