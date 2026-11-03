// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Dialog from '@ordinate/components/dialog';
import SpaceBetween from '@ordinate/components/space-between';

export default function WithoutHeader() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="s" alignItems="center">
        <Button
          iconName="support"
          onClick={() => {
            setReason(null);
            setOpen(true);
          }}
        >
          Show a tip
        </Button>
        {reason && (
          <Box color="text-body-secondary" fontSize="body-s">
            Closed with {reason}.
          </Box>
        )}
      </SpaceBetween>
      {open && (
        <Dialog
          ariaLabel="Tip"
          onDismiss={event => {
            setReason(event.detail.reason);
            setOpen(false);
          }}
        >
          Press Escape or the close button to hide this tip. Focus goes back to the button that opened it.
        </Dialog>
      )}
    </SpaceBetween>
  );
}
