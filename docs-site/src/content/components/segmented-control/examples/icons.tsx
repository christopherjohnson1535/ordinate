// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';

export default function Icons() {
  const [view, setView] = useState('list');
  const [layout, setLayout] = useState('vertical');

  return (
    <SpaceBetween direction="horizontal" size="l" alignItems="center">
      <SegmentedControl
        label="Show nodes as"
        selectedId={view}
        onChange={event => setView(event.detail.selectedId)}
        options={[
          { id: 'list', text: 'List', iconName: 'list-view' },
          { id: 'grid', text: 'Grid', iconName: 'grid-view' },
          { id: 'map', text: 'Map', iconName: 'map' },
        ]}
      />
      <SegmentedControl
        label="Split the editor"
        selectedId={layout}
        onChange={event => setLayout(event.detail.selectedId)}
        options={[
          { id: 'full', iconName: 'layout-full', iconAlt: 'One pane' },
          { id: 'vertical', iconName: 'layout-vertical', iconAlt: 'Side by side' },
          { id: 'horizontal', iconName: 'layout-horizontal', iconAlt: 'Top and bottom' },
        ]}
      />
    </SpaceBetween>
  );
}
