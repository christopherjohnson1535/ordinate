// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Header from '@ordinate/components/header';
import SpaceBetween from '@ordinate/components/space-between';

export default function Variants() {
  return (
    <SpaceBetween size="l">
      <Header variant="h1" description="Everything that runs in us-mountain-1.">
        North annex
      </Header>
      <Header variant="h2" description="Machines, volumes and gateways.">
        Resources
      </Header>
      <Header variant="h3">Volumes</Header>
    </SpaceBetween>
  );
}
