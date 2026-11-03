// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Divider from '@ordinate/components/divider';
import SpaceBetween from '@ordinate/components/space-between';

export default function BetweenSections() {
  return (
    <SpaceBetween size="m">
      <div>
        <Box variant="h4">Compute</Box>
        <Box color="text-body-secondary">12 nodes in us-mountain-1, 3 of them reserved.</Box>
      </div>
      <Divider />
      <div>
        <Box variant="h4">Storage</Box>
        <Box color="text-body-secondary">4 volumes, 1.4 TB in all.</Box>
      </div>
      <Divider />
      <div>
        <Box variant="h4">Network</Box>
        <Box color="text-body-secondary">2 gateways and one private subnet.</Box>
      </div>
    </SpaceBetween>
  );
}
