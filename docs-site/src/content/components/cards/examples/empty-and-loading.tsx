// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Cards from '@ordinate/components/cards';
import Header from '@ordinate/components/header';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';

interface Backup {
  id: string;
  taken: string;
}

export default function EmptyAndLoading() {
  const [state, setState] = useState('empty');

  return (
    <SpaceBetween size="m">
      <SegmentedControl
        label="State"
        selectedId={state}
        onChange={event => setState(event.detail.selectedId)}
        options={[
          { id: 'empty', text: 'Empty' },
          { id: 'loading', text: 'Loading' },
        ]}
      />
      <Cards<Backup>
        items={[]}
        loading={state === 'loading'}
        loadingText="Loading backups"
        header={<Header>Backups of vault-store</Header>}
        cardDefinition={{ header: backup => backup.id }}
        empty={
          <Box textAlign="center">
            <SpaceBetween size="xs">
              <Box variant="strong">No backups yet</Box>
              <Box color="text-body-secondary">Take a backup to restore vault-store from it later.</Box>
              <Button>Take a backup</Button>
            </SpaceBetween>
          </Box>
        }
      />
    </SpaceBetween>
  );
}
