// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import ButtonDropdown from '@ordinate/components/button-dropdown';
import SpaceBetween from '@ordinate/components/space-between';

export default function SplitButton() {
  const [result, setResult] = useState('Nothing deployed yet.');

  return (
    <SpaceBetween size="m" alignItems="center">
      <SpaceBetween direction="horizontal" size="s">
        <ButtonDropdown
          variant="primary"
          ariaLabel="More ways to deploy"
          mainAction={{ text: 'Deploy', onClick: () => setResult('Deploying to all zones.') }}
          items={[
            { id: 'canary', text: 'Deploy to one zone first', description: 'us-mountain-1a, then the rest.' },
            { id: 'schedule', text: 'Schedule for the maintenance window' },
          ]}
          onItemClick={event => setResult(`Chose "${event.detail.id}".`)}
        />
        <ButtonDropdown
          ariaLabel="More export formats"
          mainAction={{ text: 'Export CSV', iconName: 'download', onClick: () => setResult('Exported as CSV.') }}
          items={[
            { id: 'json', text: 'Export JSON' },
            { id: 'parquet', text: 'Export Parquet' },
          ]}
          onItemClick={event => setResult(`Chose "${event.detail.id}".`)}
        />
      </SpaceBetween>
      <Box color="text-body-secondary" fontSize="body-s">
        {result}
      </Box>
    </SpaceBetween>
  );
}
