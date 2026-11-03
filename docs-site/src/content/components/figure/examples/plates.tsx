// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import Figure from '@ordinate/components/figure';
import Media from '@ordinate/components/media';
import StyleScope from '@ordinate/components/style-scope';

// Ink drawings in the text color, so they read in light and dark mode.
function Plan() {
  return (
    <svg viewBox="0 0 300 200" role="img" aria-label="Plan of the ground floor">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="30" y="30" width="240" height="140" />
        <path d="M30 100 H150 V170 M150 30 V70 M190 100 H270" />
        <path d="M150 70 A30 30 0 0 1 180 100" strokeDasharray="3 3" />
      </g>
    </svg>
  );
}

function Section() {
  return (
    <svg viewBox="0 0 300 200" role="img" aria-label="Section through the living room">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 170h260M50 170V80l100-50 100 50v90" />
        <path d="M50 80h200M110 170v-50h40v50" strokeWidth="0.75" />
      </g>
    </svg>
  );
}

export default function Plates() {
  return (
    <StyleScope styleName="studio">
      <ColumnLayout columns={2}>
        <Figure
          media={
            <Media aspectRatio="3:2" fit="contain">
              <Plan />
            </Media>
          }
          label="Plate I"
          caption="Ground floor. One room for cooking and eating, opening south."
        />
        <Figure
          media={
            <Media aspectRatio="3:2" fit="contain">
              <Section />
            </Media>
          }
          label="Plate II"
          caption="Section A–A. The roof follows the old net loft."
          credit="Drawings: Harbour & Pine"
        />
      </ColumnLayout>
    </StyleScope>
  );
}
