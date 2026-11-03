// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import MenuTile from '@ordinate/components/menu-tile';
import StyleScope from '@ordinate/components/style-scope';

export default function CafeMenu() {
  return (
    <StyleScope styleName="shopfront">
      <ColumnLayout columns={2}>
        <MenuTile
          title="Breakfast"
          description="Served until half past eleven."
          items={[
            { label: 'Toast and jam', value: '4.50', description: 'Sourdough or rye, with this week’s jam.' },
            { label: 'Porridge with stewed apple', value: '6.00' },
            { label: 'Eggs on toast', value: '7.50', description: 'Fried, poached or scrambled.' },
          ]}
          footer="Gluten-free bread on request."
        />
        <MenuTile
          badge="New"
          title="Lunch"
          description="From twelve, while it lasts."
          items={[
            { label: 'Soup of the day with bread', value: '7.00' },
            { label: 'Leek and cheese tart', value: '9.50', description: 'With a green salad.' },
            { label: 'Sandwich of the day', value: '8.00' },
          ]}
        />
      </ColumnLayout>
    </StyleScope>
  );
}
