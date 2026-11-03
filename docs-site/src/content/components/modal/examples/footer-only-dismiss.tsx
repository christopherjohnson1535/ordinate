// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Modal from '@ordinate/components/modal';
import SpaceBetween from '@ordinate/components/space-between';

export default function FooterOnlyDismiss() {
  const [visible, setVisible] = useState(false);
  const [deleted, setDeleted] = useState(false);

  return (
    <SpaceBetween size="m" alignItems="center">
      <Button variant="destructive" disabled={deleted} onClick={() => setVisible(true)}>
        Delete north-annex
      </Button>
      <Box color="text-body-secondary" fontSize="body-s">
        {deleted ? 'north-annex was deleted.' : 'north-annex has 12 nodes.'}
      </Box>
      <Modal
        visible={visible}
        size="small"
        kind="policy"
        reference="P2"
        hideDismissButton={true}
        header="Delete north-annex?"
        onDismiss={() => setVisible(false)}
        footer={
          <>
            <Button variant="link" onClick={() => setVisible(false)}>
              Keep project
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleted(true);
                setVisible(false);
              }}
            >
              Delete project
            </Button>
          </>
        }
      >
        This removes the project, its 12 nodes and all stored logs. You cannot undo this.
      </Modal>
    </SpaceBetween>
  );
}
