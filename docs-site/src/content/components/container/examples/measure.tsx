// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Container from '@ordinate/components/container';
import SpaceBetween from '@ordinate/components/space-between';

const allVolumes = ['vol-root-01', 'vol-root-02', 'vol-data-01', 'vol-data-02', 'vol-archive-01'];

export default function Measure() {
  const [volumes, setVolumes] = useState(allVolumes.slice(0, 3));

  return (
    <Container
      kind="resource"
      reference="R2"
      heading="Volumes"
      measure={volumes.length === 1 ? '1 volume' : `${volumes.length} volumes`}
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          <Button onClick={() => setVolumes(volumes.slice(0, -1))} disabled={volumes.length === 0}>
            Detach
          </Button>
          <Button
            iconName="add"
            onClick={() => setVolumes(allVolumes.slice(0, volumes.length + 1))}
            disabled={volumes.length === allVolumes.length}
          >
            Attach
          </Button>
        </SpaceBetween>
      }
    >
      {volumes.length === 0 ? (
        <Box color="text-body-secondary">No volumes attached.</Box>
      ) : (
        <SpaceBetween size="xxs">
          {volumes.map(volume => (
            <Box key={volume} variant="code">
              {volume}
            </Box>
          ))}
        </SpaceBetween>
      )}
    </Container>
  );
}
