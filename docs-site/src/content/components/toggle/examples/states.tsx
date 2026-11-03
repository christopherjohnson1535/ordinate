// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import SpaceBetween from '@ordinate/components/space-between';
import Toggle from '@ordinate/components/toggle';

export default function States() {
  return (
    <ColumnLayout columns={2}>
      <SpaceBetween size="s">
        <Toggle checked={false} disabled={true} description="Needs the Team plan.">
          Audit log export
        </Toggle>
        <Toggle checked={true} disabled={true} description="Required in us-mountain-1.">
          Encryption at rest
        </Toggle>
      </SpaceBetween>
      <SpaceBetween size="s">
        <Toggle checked={false} readOnly={true} description="Set by your organization.">
          Public sharing
        </Toggle>
        <Toggle checked={true} readOnly={true} description="Set by your organization.">
          Two-step sign-in
        </Toggle>
      </SpaceBetween>
    </ColumnLayout>
  );
}
