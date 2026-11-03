// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Opening from '@ordinate/components/opening';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';

function Bicycle() {
  return (
    <svg viewBox="0 0 320 220" role="img" aria-label="A town bicycle with a basket">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <circle cx="84" cy="146" r="46" />
        <circle cx="236" cy="146" r="46" />
        <path d="M84 146l52-70h70l30 70M136 76l26 70h-78M162 146l44-70M128 60h22M206 76l-6-24h20" />
        <path d="M204 34h40l-6 22h-30z" strokeWidth="0.75" />
      </g>
    </svg>
  );
}

export default function Split() {
  const [message, setMessage] = useState('');

  return (
    <StyleScope styleName="shopfront">
      <Opening
        variant="split"
        badge="Open Sundays"
        kicker="Bicycle repairs in Leith"
        title="Back on the road by teatime."
        description="Punctures, brakes and full services. Drop it off before ten and most bikes are ready the same day."
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="primary" onClick={() => setMessage('Opening the booking form.')}>
              Book a repair
            </Button>
            <Button onClick={() => setMessage('Opening the price list.')}>See prices</Button>
          </SpaceBetween>
        }
        media={<Bicycle />}
      />
      {message && (
        <Box color="text-body-secondary" fontSize="body-s">
          {message}
        </Box>
      )}
    </StyleScope>
  );
}
