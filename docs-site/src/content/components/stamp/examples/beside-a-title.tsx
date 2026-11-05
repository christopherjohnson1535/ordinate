// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Header from '@ordinate/components/header';
import SpaceBetween from '@ordinate/components/space-between';
import Stamp from '@ordinate/components/stamp';

export default function BesideATitle() {
  const [approved, setApproved] = useState(false);

  return (
    <SpaceBetween size="m">
      <Header
        variant="h2"
        description="Change request for north-annex, raised by Dana Ruiz on 30 October 2026."
        actions={
          <Button variant="primary" onClick={() => setApproved(current => !current)}>
            {approved ? 'Withdraw approval' : 'Approve'}
          </Button>
        }
      >
        <SpaceBetween direction="horizontal" size="s" alignItems="center">
          <span>CR-2041: Move gallery-east to us-mountain-1</span>
          {approved ? <Stamp type="complete">Approved</Stamp> : <Stamp type="draft">Draft</Stamp>}
        </SpaceBetween>
      </Header>
      <Box color="text-body-secondary">
        Moves the 4 nodes of gallery-east during the Sunday maintenance window. Expected downtime is under 5 minutes.
      </Box>
    </SpaceBetween>
  );
}
