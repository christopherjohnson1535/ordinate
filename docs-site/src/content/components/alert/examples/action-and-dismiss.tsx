// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Alert from '@ordinate/components/alert';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';

export default function ActionAndDismiss() {
  const [visible, setVisible] = useState(true);
  const [log, setLog] = useState('');

  if (!visible) {
    return (
      <SpaceBetween size="s">
        <Box color="text-body-secondary" fontSize="body-s">
          Alert dismissed. {log}
        </Box>
        <Button onClick={() => setVisible(true)}>Show the alert again</Button>
      </SpaceBetween>
    );
  }

  return (
    <SpaceBetween size="s">
      <Alert
        type="caution"
        header="Some nodes are running an old agent"
        dismissible={true}
        dismissAriaLabel="Dismiss the agent notice"
        onDismiss={() => setVisible(false)}
        action={<Button onClick={() => setLog('Agent update started on 3 nodes.')}>Update agents</Button>}
      >
        north-annex-04, north-annex-07 and north-annex-11 are on agent 3.2, which stops receiving security fixes at the
        end of the month.
      </Alert>
      {log && (
        <Box color="text-body-secondary" fontSize="body-s">
          {log}
        </Box>
      )}
    </SpaceBetween>
  );
}
