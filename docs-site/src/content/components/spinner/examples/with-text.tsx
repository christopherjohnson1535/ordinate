// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import LiveRegion from '@ordinate/components/live-region';
import SpaceBetween from '@ordinate/components/space-between';
import Spinner from '@ordinate/components/spinner';

export default function WithText() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!checking) {
      return;
    }
    const timer = window.setTimeout(() => setChecking(false), 2500);
    return () => window.clearTimeout(timer);
  }, [checking]);

  return (
    <SpaceBetween size="m" alignItems="center">
      <LiveRegion>
        {checking ? (
          <SpaceBetween direction="horizontal" size="xs" alignItems="center">
            <Spinner />
            <Box color="text-body-secondary">Checking which nodes are reachable</Box>
          </SpaceBetween>
        ) : (
          <Box color="text-body-secondary">12 of 12 nodes are reachable.</Box>
        )}
      </LiveRegion>
      <Button onClick={() => setChecking(true)} disabled={checking}>
        Check again
      </Button>
    </SpaceBetween>
  );
}
