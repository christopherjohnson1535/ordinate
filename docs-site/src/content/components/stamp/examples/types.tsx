// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import SpaceBetween from '@ordinate/components/space-between';
import Stamp from '@ordinate/components/stamp';

export default function Types() {
  return (
    <SpaceBetween direction="horizontal" size="l" alignItems="center">
      <Stamp type="success">Approved</Stamp>
      <Stamp type="info">In review</Stamp>
      <Stamp type="warning">On hold</Stamp>
      <Stamp type="error">Rejected</Stamp>
      <Stamp type="neutral">Archived</Stamp>
      <Stamp type="draft">Draft</Stamp>
    </SpaceBetween>
  );
}
