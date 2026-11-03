// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Link from '@ordinate/components/link';

export default function External() {
  return (
    <Box variant="p">
      Check the{' '}
      <Link variant="primary" href="https://example.com" external={true} externalIconAriaLabel="Opens in a new tab">
        status page for us-mountain-1
      </Link>{' '}
      before you start a deployment.
    </Box>
  );
}
