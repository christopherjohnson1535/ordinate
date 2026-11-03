// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Dialog from '@ordinate/components/dialog';
import SpaceBetween from '@ordinate/components/space-between';

export default function Notice() {
  const [open, setOpen] = useState(false);
  const [viewed, setViewed] = useState(false);

  return (
    <SpaceBetween size="m">
      <Button disabled={open} onClick={() => setOpen(true)}>
        Restart na-03
      </Button>
      {open && (
        <Dialog
          header="Node na-03 restarted"
          onDismiss={() => setOpen(false)}
          footer={
            <Button
              onClick={() => {
                setViewed(true);
                setOpen(false);
              }}
            >
              View log
            </Button>
          }
        >
          The node restarted at 14:02 after a kernel update. All jobs resumed.
        </Dialog>
      )}
      {viewed && (
        <Box color="text-body-secondary" fontSize="body-s">
          Opened the log of na-03.
        </Box>
      )}
    </SpaceBetween>
  );
}
