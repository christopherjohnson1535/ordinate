// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Popover from '@ordinate/components/popover';

export default function Portal() {
  return (
    <Box variant="p">
      The deployment finished in{' '}
      <Popover
        renderWithPortal={true}
        position="bottom"
        size="large"
        header="Deployment time"
        content="Measured from the first node draining to the last node passing its health check. Waiting for the maintenance window is not counted."
      >
        4 min 12 s
      </Popover>
      .
    </Box>
  );
}
