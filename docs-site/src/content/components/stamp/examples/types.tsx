// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import SpaceBetween from '@ordinate/components/space-between';
import Stamp from '@ordinate/components/stamp';

export default function Types() {
  return (
    <SpaceBetween direction="horizontal" size="l" alignItems="center">
      <Stamp type="complete">Approved</Stamp>
      <Stamp type="note">In review</Stamp>
      <Stamp type="caution">On hold</Stamp>
      <Stamp type="fault">Rejected</Stamp>
      <Stamp type="neutral">Archived</Stamp>
      <Stamp type="draft">Draft</Stamp>
    </SpaceBetween>
  );
}
