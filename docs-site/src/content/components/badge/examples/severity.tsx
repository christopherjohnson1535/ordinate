// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Badge from '@ordinate/components/badge';
import SpaceBetween from '@ordinate/components/space-between';

export default function Severity() {
  return (
    <SpaceBetween direction="horizontal" size="m" alignItems="center">
      <Badge tone="critical">Critical</Badge>
      <Badge tone="high">High</Badge>
      <Badge tone="medium">Medium</Badge>
      <Badge tone="low">Low</Badge>
    </SpaceBetween>
  );
}
