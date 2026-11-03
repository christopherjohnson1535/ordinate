// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ActionCard from '@ordinate/components/action-card';
import Box from '@ordinate/components/box';
import ColumnLayout from '@ordinate/components/column-layout';
import SpaceBetween from '@ordinate/components/space-between';

export default function StartTasks() {
  const [started, setStarted] = useState('Nothing started yet.');

  return (
    <SpaceBetween size="m">
      <ColumnLayout columns={3}>
        <ActionCard
          header="Create a cluster"
          description="Run services on nodes in us-mountain-1."
          iconName="add"
          kind="resource"
          onClick={() => setStarted('Opened: Create a cluster')}
        />
        <ActionCard
          header="Import a drawing set"
          description="Bring in the north-annex sheets from a ZIP file."
          iconName="upload"
          onClick={() => setStarted('Opened: Import a drawing set')}
        />
        <ActionCard
          header="Invite people"
          description="Give your team access to this project."
          iconName="person"
          onClick={() => setStarted('Opened: Invite people')}
        />
      </ColumnLayout>
      <Box color="text-body-secondary" fontSize="body-s">
        {started}
      </Box>
    </SpaceBetween>
  );
}
