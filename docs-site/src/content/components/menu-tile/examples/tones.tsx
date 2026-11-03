// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import MenuTile from '@ordinate/components/menu-tile';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope, { StyleScopeProps } from '@ordinate/components/style-scope';

export default function Tones() {
  const [styleName, setStyleName] = useState<StyleScopeProps.StyleName>('shopfront');

  return (
    <SpaceBetween size="m">
      <SegmentedControl
        label="Page style"
        selectedId={styleName}
        options={[
          { id: 'console', text: 'Console' },
          { id: 'editorial', text: 'Editorial' },
          { id: 'studio', text: 'Studio' },
          { id: 'shopfront', text: 'Shopfront' },
        ]}
        onChange={event => setStyleName(event.detail.selectedId as StyleScopeProps.StyleName)}
      />
      <StyleScope styleName={styleName}>
        <ColumnLayout columns={3} minColumnWidth={200}>
          <MenuTile
            title="Cuts"
            items={[
              { label: 'Haircut', value: '$32', description: 'Wash, cut and dry.' },
              { label: 'Children under twelve', value: '$20' },
            ]}
          />
          <MenuTile
            tone="accent"
            title="Shaves"
            items={[
              { label: 'Beard trim', value: '$15' },
              { label: 'Hot towel shave', value: '$28' },
            ]}
          />
          <MenuTile
            tone="emphasis"
            badge="Saturdays"
            title="Walk-ins"
            items={[
              { label: 'Haircut, no booking', value: '$32' },
              { label: 'Beard trim, no booking', value: '$15' },
            ]}
          />
        </ColumnLayout>
      </StyleScope>
    </SpaceBetween>
  );
}
