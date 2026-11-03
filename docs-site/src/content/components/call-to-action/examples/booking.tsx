// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import CallToAction from '@ordinate/components/call-to-action';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';

export default function Booking() {
  const [message, setMessage] = useState('');

  return (
    <StyleScope styleName="shopfront">
      <SpaceBetween size="s">
        <CallToAction
          heading="Bring it in before ten"
          description="Most repairs are ready the same afternoon."
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary" onClick={() => setMessage('Opening the booking form.')}>
                Book a repair
              </Button>
              <Button onClick={() => setMessage('Calling 0131 555 0142.')}>Call the workshop</Button>
            </SpaceBetween>
          }
        />
        {message && (
          <Box color="text-body-secondary" fontSize="body-s">
            {message}
          </Box>
        )}
      </SpaceBetween>
    </StyleScope>
  );
}
