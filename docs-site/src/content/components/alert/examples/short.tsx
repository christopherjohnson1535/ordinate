// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Alert from '@ordinate/components/alert';
import SpaceBetween from '@ordinate/components/space-between';

export default function Short() {
  return (
    <SpaceBetween size="s">
      <Alert type="complete" header="Changes saved" />
      <Alert type="note">You are viewing revision 2026.1 of this project. Dana Ruiz published 2026.2 on Friday.</Alert>
    </SpaceBetween>
  );
}
