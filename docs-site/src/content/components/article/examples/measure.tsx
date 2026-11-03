// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Article, { ArticleProps } from '@ordinate/components/article';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';

export default function Measure() {
  const [measure, setMeasure] = useState<ArticleProps.Measure>('default');

  return (
    <SpaceBetween size="l">
      <SegmentedControl
        label="Measure"
        selectedId={measure}
        options={[
          { id: 'narrow', text: 'Narrow' },
          { id: 'default', text: 'Default' },
          { id: 'wide', text: 'Wide' },
        ]}
        onChange={event => setMeasure(event.detail.selectedId as ArticleProps.Measure)}
      />
      <StyleScope styleName="studio">
        <Article measure={measure}>
          <p>
            The studio is closed from 24 December and opens again on 5 January. Site visits booked for the first week of
            January go ahead as planned; we will call the week before to confirm.
          </p>
          <p>
            Drawings for Hut No. 3 are with the planning office. If you are a neighbour and want to see them, ask at the
            door or write to us, and we will post a set.
          </p>
        </Article>
      </StyleScope>
    </SpaceBetween>
  );
}
