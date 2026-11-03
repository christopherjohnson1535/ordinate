// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import SpaceBetween from '@ordinate/components/space-between';

export default function StatusColors() {
  return (
    <SpaceBetween size="xxs">
      <Box color="text-status-success">Backup finished: 214 GB in 18 minutes.</Box>
      <Box color="text-status-info">A new image, base-2026.11, is ready to roll out.</Box>
      <Box color="text-status-warning">node-07 is above 90% disk for 3 hours.</Box>
      <Box color="text-status-error">The gateway failed its health check twice.</Box>
      <Box color="text-status-inactive">node-11 is stopped and not billed.</Box>
    </SpaceBetween>
  );
}
