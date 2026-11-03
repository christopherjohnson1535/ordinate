// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '@ordinate/components/badge';
import Button from '@ordinate/components/button';
import Container from '@ordinate/components/container';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import ProgressBar from '@ordinate/components/progress-bar';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';

export default function Specimen() {
  const [range, setRange] = useState('week');
  const [deploying, setDeploying] = useState(false);

  return (
    <Container
      kind="resource"
      reference="R1"
      heading="north-annex"
      description="Production environment, us-mountain-1."
      measure="20 nodes"
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          <Button>Restart</Button>
          <Button variant="primary" loading={deploying} onClick={() => setDeploying(current => !current)}>
            Deploy
          </Button>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="l">
        <KeyValuePairs
          columns={2}
          items={[
            { label: 'Status', value: <StatusIndicator state="complete">Running</StatusIndicator> },
            { label: 'Tier', value: <Badge tone="note">Standard</Badge> },
            { label: 'Last deploy', value: 'Nov 2, 14:08' },
            { label: 'Alarms', value: <StatusIndicator state="caution">1 open</StatusIndicator> },
          ]}
        />
        <SegmentedControl
          label="Usage over"
          selectedId={range}
          options={[
            { id: 'day', text: 'Day' },
            { id: 'week', text: 'Week' },
            { id: 'month', text: 'Month' },
          ]}
          onChange={event => setRange(event.detail.selectedId ?? 'week')}
        />
        <ProgressBar
          label="Compute hours"
          value={range === 'day' ? 18 : range === 'week' ? 46 : 64}
          additionalInfo="Resets on the first of each month."
        />
      </SpaceBetween>
    </Container>
  );
}
