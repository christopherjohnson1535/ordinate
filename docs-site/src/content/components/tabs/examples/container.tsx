// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Tabs from '@ordinate/components/tabs';

export default function Container() {
  return (
    <Tabs
      ariaLabel="Cluster settings"
      variant="container"
      kind="configuration"
      tabs={[
        {
          id: 'general',
          label: 'General',
          reference: 'C1',
          content: <Box>Name north-annex, version 1.30, created by Dana Ruiz.</Box>,
        },
        {
          id: 'network',
          label: 'Network',
          reference: 'C2',
          content: <Box>Private subnet 10.4.0.0/16, with two public load balancers.</Box>,
        },
        {
          id: 'scaling',
          label: 'Scaling',
          reference: 'C3',
          content: <Box>Between 3 and 12 nodes, scaling up at 70% CPU.</Box>,
        },
      ]}
    />
  );
}
