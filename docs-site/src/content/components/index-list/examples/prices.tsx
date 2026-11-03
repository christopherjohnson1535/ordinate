// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import IndexList from '@ordinate/components/index-list';
import StyleScope from '@ordinate/components/style-scope';

export default function Prices() {
  return (
    <StyleScope styleName="shopfront">
      <ColumnLayout columns={2}>
        <IndexList
          ariaLabel="Prices"
          items={[
            { id: 'cut', label: 'Haircut', value: '$32', meta: 'Wash, cut and dry' },
            { id: 'beard', label: 'Beard trim', value: '$15' },
            { id: 'kids', label: 'Children under twelve', value: '$20' },
            { id: 'colour', label: 'Colour', value: 'Ask us' },
          ]}
        />
        <IndexList
          ariaLabel="Prices for regulars"
          size="large"
          items={[
            { id: 'monthly', label: 'Monthly cut', value: '$28' },
            { id: 'pair', label: 'Parent and child', value: '$45' },
          ]}
        />
      </ColumnLayout>
    </StyleScope>
  );
}
