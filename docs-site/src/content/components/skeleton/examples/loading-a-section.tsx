// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Container from '@ordinate/components/container';
import Skeleton from '@ordinate/components/skeleton';
import SpaceBetween from '@ordinate/components/space-between';

export default function LoadingASection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      return;
    }
    const timer = window.setTimeout(() => setLoading(false), 2500);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <SpaceBetween size="m">
      <Box>
        <Button onClick={() => setLoading(true)} disabled={loading}>
          Load again
        </Button>
      </Box>
      <Container heading="Usage this month">
        <Skeleton loading={loading} lines={3} loadingText="Loading usage">
          <Box>
            north-annex used 4,120 instance hours and 2.4 TB of transfer this month, 12% more than in October. Most of
            the increase came from gallery-east, which ran on 4 nodes instead of 2 for the last week.
          </Box>
        </Skeleton>
      </Container>
    </SpaceBetween>
  );
}
