// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Link from '@ordinate/components/link';
import PanelLayout from '@ordinate/components/panel-layout';
import SpaceBetween from '@ordinate/components/space-between';

const tickets = ['2041, rear brake', '2042, puncture', '2043, gears'];

export default function Display() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <PanelLayout
      display={selected ? 'main-only' : 'panel-only'}
      panelContent={
        <Box padding="l">
          <SpaceBetween size="xs">
            <Box variant="h3">Repair queue</Box>
            {tickets.map(ticket => (
              <Link
                key={ticket}
                href={`https://example.com/fixit-bikes/queue/${ticket.slice(0, 4)}`}
                onFollow={event => {
                  event.preventDefault();
                  setSelected(ticket);
                }}
              >
                {ticket}
              </Link>
            ))}
          </SpaceBetween>
        </Box>
      }
      mainContent={
        <Box padding="l">
          <SpaceBetween size="s">
            <Button variant="link" iconName="arrow-left" onClick={() => setSelected(null)}>
              Back to the queue
            </Button>
            <Box variant="h3">Ticket {selected}</Box>
            <Box variant="p">Quote sent at 9:40, promised for today.</Box>
          </SpaceBetween>
        </Box>
      }
    />
  );
}
