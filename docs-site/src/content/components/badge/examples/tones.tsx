// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Badge from '@ordinate/components/badge';
import SpaceBetween from '@ordinate/components/space-between';

export default function Tones() {
  return (
    <SpaceBetween direction="horizontal" size="m" alignItems="center">
      <Badge>Draft</Badge>
      <Badge tone="note">New</Badge>
      <Badge tone="complete">Verified</Badge>
      <Badge tone="fault">Overdue</Badge>
    </SpaceBetween>
  );
}
