// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import Measure from '@ordinate/components/measure';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';

const limit = 90;

export default function Limit() {
  const [used, setUsed] = useState(61);
  const over = used >= limit;

  return (
    <SpaceBetween size="m">
      <Measure
        label="Disk used on north-annex-07"
        value={used}
        unit="GB"
        max={100}
        limit={limit}
        limitLabel={`alarm at ${limit} GB`}
      />
      {over ? (
        <StatusIndicator state="caution">Above the alarm. Old snapshots will be removed tonight.</StatusIndicator>
      ) : (
        <StatusIndicator state="complete">Below the alarm</StatusIndicator>
      )}
      <SpaceBetween direction="horizontal" size="xs">
        <Button onClick={() => setUsed(current => Math.min(100, current + 8))}>Write 8 GB</Button>
        <Button variant="link" onClick={() => setUsed(61)}>
          Reset
        </Button>
      </SpaceBetween>
    </SpaceBetween>
  );
}
