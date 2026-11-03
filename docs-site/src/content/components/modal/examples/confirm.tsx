// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Modal from '@ordinate/components/modal';
import SpaceBetween from '@ordinate/components/space-between';

export default function Confirm() {
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState('vault-store is running.');

  return (
    <SpaceBetween size="m" alignItems="center">
      <Button onClick={() => setVisible(true)}>Restart vault-store</Button>
      <Box color="text-body-secondary" fontSize="body-s">
        {result}
      </Box>
      <Modal
        visible={visible}
        onDismiss={event => {
          setVisible(false);
          setResult(`Closed with ${event.detail.reason}; nothing restarted.`);
        }}
        header="Restart vault-store?"
        footer={
          <>
            <Button variant="link" onClick={() => setVisible(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setVisible(false);
                setResult('vault-store is restarting.');
              }}
            >
              Restart
            </Button>
          </>
        }
      >
        Both nodes restart one at a time. Requests go to the other node while each one restarts.
      </Modal>
    </SpaceBetween>
  );
}
