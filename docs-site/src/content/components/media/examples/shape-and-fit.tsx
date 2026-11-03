// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Grid from '@ordinate/components/grid';
import Media, { MediaProps } from '@ordinate/components/media';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';

// A tall product shot, drawn inline so the example needs no network.
const chair = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
    <rect width="800" height="1000" fill="#ece8e1"/><rect y="760" width="800" height="240" fill="#d8d1c5"/>
    <rect x="250" y="260" width="300" height="320" fill="#8c6a4f"/><rect x="250" y="560" width="300" height="60" fill="#6f533d"/>
    <rect x="262" y="620" width="24" height="220" fill="#4b3a2c"/><rect x="514" y="620" width="24" height="220" fill="#4b3a2c"/>
  </svg>`
)}`;

const ratios: MediaProps.AspectRatio[] = ['1:1', '4:3', '3:2', '16:9', '4:5', 'auto'];

export default function ShapeAndFit() {
  const [ratio, setRatio] = useState<MediaProps.AspectRatio>('16:9');
  const [fit, setFit] = useState<MediaProps.Fit>('cover');

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="m">
        <SegmentedControl
          label="Aspect ratio"
          selectedId={ratio}
          options={ratios.map(id => ({ id, text: id }))}
          onChange={event => setRatio(event.detail.selectedId as MediaProps.AspectRatio)}
        />
        <SegmentedControl
          label="Fit"
          selectedId={fit}
          options={[
            { id: 'cover', text: 'Cover' },
            { id: 'contain', text: 'Contain' },
          ]}
          onChange={event => setFit(event.detail.selectedId as MediaProps.Fit)}
        />
      </SpaceBetween>
      <Grid gridDefinition={[{ colspan: { default: 12, xs: 6 } }]}>
        <Media src={chair} alt="An oak chair against a pale wall" aspectRatio={ratio} fit={fit} />
      </Grid>
    </SpaceBetween>
  );
}
