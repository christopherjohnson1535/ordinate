// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';

export default function TextStyles() {
  return (
    <SpaceBetween size="s">
      <Box variant="h2">North annex</Box>
      <Box variant="h3">Nodes and volumes</Box>
      <Box variant="p">
        The north-annex project runs 12 nodes in us-mountain-1. Run <Box variant="inline-code">ord nodes list</Box> to
        see them, or <Box variant="strong">open the schedule</Box> for their owners.
      </Box>
      <Box variant="small">Updated 2 minutes ago by Dana Ruiz.</Box>
      <Box variant="samp">node-04 drained in 41 s</Box>
    </SpaceBetween>
  );
}
