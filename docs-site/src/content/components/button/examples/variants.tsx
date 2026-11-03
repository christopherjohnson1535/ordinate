// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';

export default function Variants() {
  return (
    <SpaceBetween direction="horizontal" size="s" alignItems="center">
      <Button variant="primary">Deploy</Button>
      <Button>Restart</Button>
      <Button variant="link">View log</Button>
      <Button variant="destructive">Delete service</Button>
    </SpaceBetween>
  );
}
