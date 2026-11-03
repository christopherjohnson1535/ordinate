// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Flashbar, { FlashbarProps } from '@ordinate/components/flashbar';
import SpaceBetween from '@ordinate/components/space-between';

export default function Dismiss() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [log, setLog] = useState('');
  const dismiss = (id: string) => setDismissed(current => [...current, id]);

  const items: FlashbarProps.MessageDefinition[] = [
    {
      id: 'vault-store',
      type: 'fault',
      ariaRole: 'alert',
      header: 'vault-store failed its health check',
      content: 'Requests to vault-store are failing. Check the logs before you redeploy it.',
      action: <Button onClick={() => setLog('Redeploy of vault-store started.')}>Redeploy</Button>,
      dismissible: true,
      onDismiss: () => dismiss('vault-store'),
    },
    {
      id: 'saved',
      type: 'complete',
      header: 'Changes to atrium-api saved',
      dismissible: true,
      onDismiss: () => dismiss('saved'),
    },
  ];

  const visible = items.filter(item => !dismissed.includes(item.id!));

  return (
    <SpaceBetween size="s">
      <Flashbar items={visible} />
      {visible.length === 0 && (
        <Box>
          <Button onClick={() => setDismissed([])}>Show the notifications again</Button>
        </Box>
      )}
      {log && (
        <Box color="text-body-secondary" fontSize="body-s">
          {log}
        </Box>
      )}
    </SpaceBetween>
  );
}
