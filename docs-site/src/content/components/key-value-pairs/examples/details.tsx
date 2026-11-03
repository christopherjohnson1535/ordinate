// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Container from '@ordinate/components/container';
import CopyToClipboard from '@ordinate/components/copy-to-clipboard';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import Link from '@ordinate/components/link';
import ProgressBar from '@ordinate/components/progress-bar';
import StatusIndicator from '@ordinate/components/status-indicator';

export default function Details() {
  return (
    <Container heading="Node details" kind="resource">
      <KeyValuePairs
        columns={3}
        ariaLabel="Node details"
        items={[
          {
            label: 'Node ID',
            value: (
              <CopyToClipboard
                variant="inline"
                textToCopy="n-0f3a2c91d4"
                textToDisplay="n-0f3a2c91d4"
                copySuccessText="Node ID copied"
              />
            ),
          },
          { label: 'State', value: <StatusIndicator state="complete">Running</StatusIndicator> },
          {
            label: 'Region',
            value: 'us-mountain-1',
            info: (
              <Link variant="info" href="#/components/key-value-pairs">
                Info
              </Link>
            ),
          },
          { label: 'Image', value: <Link href="#/components/key-value-pairs">base-2026.10</Link> },
          {
            label: 'Disk used',
            value: <ProgressBar variant="key-value" value={72} additionalInfo="144 of 200 GB" ariaLabel="Disk used" />,
          },
          { label: 'Launched', value: '31 October 2026, 09:14 UTC' },
        ]}
      />
    </Container>
  );
}
