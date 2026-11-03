// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';
import Toggle from '@ordinate/components/toggle';

export default function Basic() {
  const [scaling, setScaling] = useState(true);

  return (
    <SpaceBetween size="s">
      <Toggle
        checked={scaling}
        onChange={event => setScaling(event.detail.checked)}
        description="Adds a node to atrium-api when CPU stays above 70% for five minutes."
      >
        Auto-scaling
      </Toggle>
      <Box color="text-body-secondary" fontSize="body-s">
        {scaling
          ? 'Auto-scaling is on. atrium-api runs 4 to 12 nodes.'
          : 'Auto-scaling is off. atrium-api stays at 6 nodes.'}
      </Box>
    </SpaceBetween>
  );
}
