// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Link from '@ordinate/components/link';
import Popover from '@ordinate/components/popover';

export default function TextTrigger() {
  return (
    <Box variant="p">
      north-annex uses{' '}
      <Popover
        header="Memory"
        content={
          <>
            512 MiB of 2 GiB in use across 12 nodes. <Link href="#/components/popover">Change limits</Link>
          </>
        }
      >
        512 MiB of memory
      </Popover>{' '}
      and keeps logs for{' '}
      <Popover header="Log retention" content="Logs older than 30 days move to cold storage in us-mountain-1.">
        30 days
      </Popover>
      .
    </Box>
  );
}
