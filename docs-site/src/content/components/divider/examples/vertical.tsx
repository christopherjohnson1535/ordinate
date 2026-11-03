// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Divider from '@ordinate/components/divider';
import SpaceBetween from '@ordinate/components/space-between';

export default function Vertical() {
  return (
    <SpaceBetween direction="horizontal" size="s">
      <Box>12 nodes</Box>
      <Divider orientation="vertical" />
      <Box>4 volumes</Box>
      <Divider orientation="vertical" />
      <Box>2 gateways</Box>
    </SpaceBetween>
  );
}
