// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Link from '@ordinate/components/link';
import SpaceBetween from '@ordinate/components/space-between';

export default function Variants() {
  return (
    <SpaceBetween size="l">
      <Box variant="p">
        Nodes in north-annex restart one zone at a time. The{' '}
        <Link variant="primary" href="#/components/link">
          maintenance guide
        </Link>{' '}
        explains how to change the window.
      </Box>
      <SpaceBetween size="xs">
        <Link href="#/components/link">Project settings</Link>
        <Link href="#/components/link">Billing and usage</Link>
        <Link href="#/components/link">Access keys</Link>
      </SpaceBetween>
    </SpaceBetween>
  );
}
