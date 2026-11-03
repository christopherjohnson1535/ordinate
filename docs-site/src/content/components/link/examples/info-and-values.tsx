// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import ColumnLayout from '@ordinate/components/column-layout';
import Link from '@ordinate/components/link';
import SpaceBetween from '@ordinate/components/space-between';

export default function InfoAndValues() {
  const [help, setHelp] = useState<string | null>(null);

  return (
    <SpaceBetween size="l">
      <ColumnLayout columns={2}>
        <SpaceBetween size="xxs">
          <Box variant="key-label">
            Running nodes{' '}
            <Link variant="info" onFollow={() => setHelp('Running nodes')}>
              Info
            </Link>
          </Box>
          <Link variant="value-large" href="#/components/link" ariaLabel="12 running nodes">
            12
          </Link>
        </SpaceBetween>
        <SpaceBetween size="xxs">
          <Box variant="key-label">
            Open alarms{' '}
            <Link variant="info" onFollow={() => setHelp('Open alarms')}>
              Info
            </Link>
          </Box>
          <Link variant="value-large" href="#/components/link" ariaLabel="3 open alarms">
            3
          </Link>
        </SpaceBetween>
      </ColumnLayout>
      <Box color="text-body-secondary" fontSize="body-s">
        {help ? `Opened help for "${help}".` : 'No help open.'}
      </Box>
    </SpaceBetween>
  );
}
