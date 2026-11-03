// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Link from '@ordinate/components/link';
import SpaceBetween from '@ordinate/components/space-between';

export default function FontSizes() {
  return (
    <SpaceBetween size="s">
      <Link href="#/components/link" fontSize="heading-m">
        north-annex
      </Link>
      <Link href="#/components/link" fontSize="body-m">
        Edit the restart window
      </Link>
      <Link href="#/components/link" fontSize="body-s">
        Last changed by Dana Ruiz
      </Link>
      <Box variant="h4">
        Nodes in{' '}
        <Link href="#/components/link" fontSize="inherit" variant="primary">
          us-mountain-1
        </Link>
      </Box>
    </SpaceBetween>
  );
}
