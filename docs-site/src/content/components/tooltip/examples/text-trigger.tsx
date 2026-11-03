// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';
import Tooltip from '@ordinate/components/tooltip';

export default function TextTrigger() {
  return (
    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
      <Box>Availability this week:</Box>
      <Tooltip content="Three of four zones served traffic the whole week">
        <Box variant="strong">75%</Box>
      </Tooltip>
    </SpaceBetween>
  );
}
