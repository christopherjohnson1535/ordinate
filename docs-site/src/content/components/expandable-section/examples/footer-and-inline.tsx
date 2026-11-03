// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Container from '@ordinate/components/container';
import ExpandableSection from '@ordinate/components/expandable-section';

export default function FooterAndInline() {
  return (
    <Container
      heading="node-04"
      description="us-mountain-1a"
      footer={
        <ExpandableSection variant="footer" headerText="Additional details">
          Launched on 31 October 2026 from image base-2026.10, owned by platform-team.
        </ExpandableSection>
      }
    >
      <Box margin={{ bottom: 's' }}>The last health check failed.</Box>
      <ExpandableSection variant="inline" headerText="Show the full error">
        <Box variant="code">ECONNRESET: socket hang up at node-04:443</Box>
      </ExpandableSection>
    </Container>
  );
}
