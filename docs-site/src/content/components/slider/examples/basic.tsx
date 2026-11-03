// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Slider from '@ordinate/components/slider';

export default function Basic() {
  const [threshold, setThreshold] = useState(70);

  return (
    <FormField
      label="Scale-up threshold"
      description="atrium-api adds a node when CPU stays above this for five minutes."
    >
      <Slider
        value={threshold}
        onChange={event => setThreshold(event.detail.value)}
        min={50}
        max={90}
        valueFormatter={value => `${value}%`}
      />
    </FormField>
  );
}
