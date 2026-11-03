// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Grid from '@ordinate/components/grid';
import Slider from '@ordinate/components/slider';
import SpaceBetween from '@ordinate/components/space-between';
import TruncatedText from '@ordinate/components/truncated-text';

export default function Resize() {
  const [span, setSpan] = useState(6);

  return (
    <SpaceBetween size="l">
      <Slider
        value={span}
        min={2}
        max={12}
        step={1}
        ariaLabel="Width in grid columns"
        onChange={event => setSpan(event.detail.value)}
      />
      <Grid gridDefinition={[{ colspan: span }]}>
        <TruncatedText>Image base-2026.11, built from ordinate/base at 4c1e9a2 by the nightly pipeline</TruncatedText>
      </Grid>
    </SpaceBetween>
  );
}
