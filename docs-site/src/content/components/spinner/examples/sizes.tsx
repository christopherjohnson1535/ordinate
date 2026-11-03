// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';
import Spinner from '@ordinate/components/spinner';

export default function Sizes() {
  return (
    <SpaceBetween direction="horizontal" size="xl" alignItems="end">
      <SpaceBetween size="xs" alignItems="center">
        <Spinner size="normal" />
        <Box fontSize="body-s" color="text-body-secondary">
          normal
        </Box>
      </SpaceBetween>
      <SpaceBetween size="xs" alignItems="center">
        <Spinner size="big" />
        <Box fontSize="body-s" color="text-body-secondary">
          big
        </Box>
      </SpaceBetween>
      <SpaceBetween size="xs" alignItems="center">
        <Spinner size="large" />
        <Box fontSize="body-s" color="text-body-secondary">
          large
        </Box>
      </SpaceBetween>
      <SpaceBetween size="xs" alignItems="center">
        <Spinner variant="disabled" />
        <Box fontSize="body-s" color="text-body-secondary">
          disabled
        </Box>
      </SpaceBetween>
    </SpaceBetween>
  );
}
