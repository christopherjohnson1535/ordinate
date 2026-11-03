// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Container from '@ordinate/components/container';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import ProgressBar from '@ordinate/components/progress-bar';
import StatusIndicator from '@ordinate/components/status-indicator';

export default function KeyValue() {
  return (
    <Container heading="Rollout of web:v2" kind="resource">
      <KeyValuePairs
        columns={3}
        items={[
          { label: 'State', value: <StatusIndicator state="underway">Rolling out</StatusIndicator> },
          {
            label: 'Replicas ready',
            value: (
              <ProgressBar variant="key-value" value={60} additionalInfo="3 of 5 replicas" ariaLabel="Replicas ready" />
            ),
          },
          {
            label: 'Health check',
            value: (
              <ProgressBar
                variant="key-value"
                status="complete"
                resultText="Passed on 5 of 5"
                ariaLabel="Health check"
              />
            ),
          },
        ]}
      />
    </Container>
  );
}
