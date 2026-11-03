// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ActionCard from '@ordinate/components/action-card';
import ColumnLayout from '@ordinate/components/column-layout';

export default function Disabled() {
  return (
    <ColumnLayout columns={2}>
      <ActionCard
        header="Restore from backup"
        description="Roll vault-store back to last night's snapshot."
        iconName="history"
        kind="resource"
        onClick={() => undefined}
      />
      <ActionCard
        header="Promote to production"
        description="Waiting for Dana Ruiz to approve the change request."
        iconName="upload"
        kind="resource"
        disabled={true}
        onClick={() => undefined}
      />
    </ColumnLayout>
  );
}
