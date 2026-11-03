// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '@ordinate/components/badge';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';

export default function Row() {
  const [stage, setStage] = useState('Waiting');

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="xs" alignItems="center">
        <Box variant="strong">Ticket 2041</Box>
        <Badge>{stage}</Badge>
        <Badge tone="note">Due today</Badge>
      </SpaceBetween>
      <SpaceBetween direction="horizontal" size="xs">
        <Button onClick={() => setStage('Quoted')}>Send quote</Button>
        <Button onClick={() => setStage('In repair')}>Start repair</Button>
        <Button variant="primary" onClick={() => setStage('Ready to collect')}>
          Mark as ready
        </Button>
      </SpaceBetween>
    </SpaceBetween>
  );
}
