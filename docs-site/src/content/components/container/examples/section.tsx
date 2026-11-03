// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import Container from '@ordinate/components/container';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import Link from '@ordinate/components/link';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';

export default function Section() {
  const [restarting, setRestarting] = useState(false);

  return (
    <Container
      kind="resource"
      reference="R1"
      heading="north-annex-web"
      description="Serves the public site of the north annex."
      measure="8 nodes"
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          <Button onClick={() => setRestarting(true)} disabled={restarting}>
            Restart
          </Button>
          <Button variant="primary">Deploy</Button>
        </SpaceBetween>
      }
      footer={
        <>
          <span>Restarts drain one zone at a time.</span>
          <Link href="#/components/container">Show all 7 services</Link>
        </>
      }
    >
      <KeyValuePairs
        columns={2}
        items={[
          {
            label: 'Status',
            value: restarting ? (
              <StatusIndicator state="underway">Restarting</StatusIndicator>
            ) : (
              <StatusIndicator state="complete">Running</StatusIndicator>
            ),
          },
          { label: 'Image', value: 'web:v2' },
          { label: 'Region', value: 'us-mountain-1' },
          { label: 'Owner', value: 'Dana Ruiz' },
          { label: 'Endpoint', value: 'north-annex.ordinate.dev' },
          { label: 'Last deploy', value: '31 October 2026, 09:14' },
        ]}
      />
    </Container>
  );
}
