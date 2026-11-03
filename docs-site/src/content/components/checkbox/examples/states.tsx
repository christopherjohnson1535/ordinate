// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Checkbox from '@ordinate/components/checkbox';
import SpaceBetween from '@ordinate/components/space-between';

export default function States() {
  return (
    <SpaceBetween size="xs">
      <Checkbox checked={true} readOnly={true} description="Required by the north-annex retention policy.">
        Encrypt backups
      </Checkbox>
      <Checkbox checked={false} disabled={true} description="Available on the team plan.">
        Keep backups in a second region
      </Checkbox>
      <Checkbox checked={true} disabled={true}>
        Daily snapshot
      </Checkbox>
    </SpaceBetween>
  );
}
