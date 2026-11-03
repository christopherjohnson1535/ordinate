// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import Media from '@ordinate/components/media';

// Ink drawings in the text color, so they read in light and dark mode.
function Plan() {
  return (
    <svg viewBox="0 0 300 200" role="img" aria-label="Plan of the ground floor of Hut No. 3">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="30" y="30" width="240" height="140" />
        <path d="M30 100 H150 V170 M150 30 V70 M190 100 H270" />
        <path d="M150 70 A30 30 0 0 1 180 100" strokeDasharray="3 3" />
      </g>
      <path d="M30 185 H270 M30 181 V189 M270 181 V189" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
}

function Elevation() {
  return (
    <svg viewBox="0 0 320 240" role="img" aria-label="South elevation of Hut No. 3">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 214h304M48 214V110l112-70 112 70v104z" />
        <path d="M78 214v-64h40v64M196 132h48v40h-48z" />
      </g>
      <path d="M48 110h224M160 40v174M48 228h224M48 224v8M272 224v8" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}

export default function Drawing() {
  return (
    <ColumnLayout columns={2}>
      <Media aspectRatio="4:3" fit="contain">
        <Plan />
      </Media>
      <Media aspectRatio="4:3" fit="contain">
        <Elevation />
      </Media>
    </ColumnLayout>
  );
}
