// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';

export default function Spacing() {
  return (
    <Box padding={{ vertical: 'l' }} textAlign="center">
      <Box variant="h3" margin={{ bottom: 'xxs' }}>
        No volumes
      </Box>
      <Box variant="p" color="text-body-secondary" margin={{ bottom: 'm' }}>
        This project has no volumes yet. Volumes keep data when a node stops.
      </Box>
      <Button iconName="add">Create volume</Button>
    </Box>
  );
}
