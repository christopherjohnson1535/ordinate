// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Container from '@ordinate/components/container';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import Skeleton from '@ordinate/components/skeleton';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';

export default function Details() {
  const [loading, setLoading] = useState(true);
  // Only the first skeleton has loading text, so the region is read as "Loading the node" once.
  const value = (text: React.ReactNode, first = false) => (
    <Skeleton loading={loading} width="large" loadingText={first ? 'Loading the node' : ''}>
      {text}
    </Skeleton>
  );

  return (
    <SpaceBetween size="m">
      <Box>
        <Button onClick={() => setLoading(current => !current)}>{loading ? 'Finish loading' : 'Load again'}</Button>
      </Box>
      <Container heading="north-annex-07" kind="resource">
        <KeyValuePairs
          columns={3}
          items={[
            { label: 'State', value: value(<StatusIndicator state="complete">Running</StatusIndicator>, true) },
            { label: 'Region', value: value('us-mountain-1') },
            { label: 'Image', value: value('base-2026.10') },
          ]}
        />
      </Container>
    </SpaceBetween>
  );
}
