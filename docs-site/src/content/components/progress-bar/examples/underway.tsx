// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import ProgressBar from '@ordinate/components/progress-bar';
import SpaceBetween from '@ordinate/components/space-between';

export default function Underway() {
  const [value, setValue] = useState(35);
  const minutesLeft = Math.ceil((100 - value) / 30);

  return (
    <SpaceBetween size="m">
      <ProgressBar
        value={value}
        label="Uploading north-annex.tar"
        description="Backup of 12 nodes, 4.2 GB"
        additionalInfo={
          value < 100 ? `About ${minutesLeft} ${minutesLeft === 1 ? 'minute' : 'minutes'} left` : 'Finishing up'
        }
      />
      <SpaceBetween direction="horizontal" size="xs">
        <Button onClick={() => setValue(current => Math.min(100, current + 15))}>Advance</Button>
        <Button variant="link" onClick={() => setValue(0)}>
          Reset
        </Button>
      </SpaceBetween>
    </SpaceBetween>
  );
}
