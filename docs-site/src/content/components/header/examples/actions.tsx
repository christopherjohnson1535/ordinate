// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Header from '@ordinate/components/header';
import Link from '@ordinate/components/link';
import SpaceBetween from '@ordinate/components/space-between';

export default function Actions() {
  const [nodes, setNodes] = useState(12);

  return (
    <SpaceBetween size="s">
      <Header
        variant="h2"
        counter={`(${nodes})`}
        info={
          <Link variant="info" href="#/components/header">
            Info
          </Link>
        }
        description="Machines that run the north-annex project. Stopped nodes are not billed."
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button>Export</Button>
            <Button variant="primary" iconName="add" onClick={() => setNodes(nodes + 1)}>
              Add node
            </Button>
          </SpaceBetween>
        }
      >
        Nodes
      </Header>
      <Box color="text-body-secondary" fontSize="body-s">
        Add a node and the counter follows.
      </Box>
    </SpaceBetween>
  );
}
