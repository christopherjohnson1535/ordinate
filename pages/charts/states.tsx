// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';

export function EmptyState() {
  return (
    <Box textAlign="center" color="text-body-secondary">
      <b>No data</b>
      <Box variant="p" color="inherit">
        There is no data to show for this period.
      </Box>
    </Box>
  );
}

export function NoMatchState() {
  return (
    <Box textAlign="center" color="text-body-secondary">
      <b>No matching data</b>
      <Box variant="p" color="inherit">
        Choose at least one item in the filter.
      </Box>
    </Box>
  );
}
