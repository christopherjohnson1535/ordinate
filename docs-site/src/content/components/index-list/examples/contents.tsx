// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import IndexList from '@ordinate/components/index-list';
import StyleScope from '@ordinate/components/style-scope';

export default function Contents() {
  return (
    <StyleScope styleName="editorial">
      <IndexList
        ariaLabel="In this issue"
        ordered={true}
        items={[
          { id: 'tide', label: 'What the tide leaves behind', value: '4', href: 'https://example.com/issue-14/tide' },
          {
            id: 'sail',
            label: 'The last sail maker on the east quay',
            value: '12',
            href: 'https://example.com/issue-14/sail',
          },
          { id: 'walk', label: 'On walking slowly', value: '21', href: 'https://example.com/issue-14/walking' },
          { id: 'soup', label: 'Leek and potato soup', value: '31', href: 'https://example.com/issue-14/soup' },
          { id: 'letters', label: 'Letters', value: '36', href: 'https://example.com/issue-14/letters' },
        ]}
      />
    </StyleScope>
  );
}
