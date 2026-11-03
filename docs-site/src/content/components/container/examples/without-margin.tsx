// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Container from '@ordinate/components/container';
import Header from '@ordinate/components/header';
import SpaceBetween from '@ordinate/components/space-between';

export default function WithoutMargin() {
  return (
    <SpaceBetween size="l">
      <Header variant="h2" description="Nodes in us-mountain-1, newest first.">
        Nodes
      </Header>
      <Container kind="resource" measure="12 nodes" actions={<Button iconName="download">Export</Button>}>
        <Box variant="p">
          na-12 and na-11 joined this morning. Every other node has run for more than 30 days without a restart.
        </Box>
      </Container>
      <Container>
        <Box variant="p">A container with content only draws its construction line and nothing else.</Box>
      </Container>
    </SpaceBetween>
  );
}
