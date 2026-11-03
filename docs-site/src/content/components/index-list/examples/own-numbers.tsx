// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import IndexList from '@ordinate/components/index-list';
import StyleScope from '@ordinate/components/style-scope';

export default function OwnNumbers() {
  return (
    <StyleScope styleName="studio">
      <IndexList
        ariaLabel="Drawings for Hut No. 3"
        variant="numbered"
        size="large"
        items={[
          { id: 'plan', number: 'A-01', label: 'Ground floor plan', meta: '1:50', value: 'Rev. C' },
          { id: 'south', number: 'A-02', label: 'South elevation', meta: '1:50', value: 'Rev. B' },
          { id: 'section', number: 'A-03', label: 'Section A–A', meta: '1:20', value: 'Rev. B' },
        ]}
      />
    </StyleScope>
  );
}
