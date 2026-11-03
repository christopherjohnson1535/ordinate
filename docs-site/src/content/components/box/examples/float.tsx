// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Link from '@ordinate/components/link';

export default function Float() {
  return (
    <div>
      <Box float="right" margin={{ left: 's' }}>
        <Link href="#/components/box">Edit</Link>
      </Box>
      <Box variant="h4">Maintenance window</Box>
      <Box variant="p" color="text-body-secondary">
        Sundays from 02:00 to 04:00 UTC. Nodes restart one zone at a time, so the service keeps answering.
      </Box>
    </div>
  );
}
