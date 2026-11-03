// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '@ordinate/components/badge';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween, { SpaceBetweenProps } from '@ordinate/components/space-between';

const sizes: SpaceBetweenProps.Size[] = ['xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'];

export default function Sizes() {
  const [size, setSize] = useState<SpaceBetweenProps.Size>('s');

  return (
    <SpaceBetween size="l">
      <SegmentedControl
        label="Size"
        selectedId={size}
        onChange={event => setSize(event.detail.selectedId as SpaceBetweenProps.Size)}
        options={sizes.map(id => ({ id, text: id }))}
      />
      <SpaceBetween direction="horizontal" size={size}>
        <Badge>Drop off</Badge>
        <Badge>Quote</Badge>
        <Badge>Repair</Badge>
        <Badge>Collect</Badge>
      </SpaceBetween>
    </SpaceBetween>
  );
}
