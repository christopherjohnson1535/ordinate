// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '@ordinate/components/button';
import Opening from '@ordinate/components/opening';
import StyleScope from '@ordinate/components/style-scope';

// A line drawing of a timber hut. It only decorates: the caption names it.
function Elevation() {
  return (
    <svg viewBox="0 0 320 240" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M8 214h304" strokeWidth="2.5" />
        <path d="M48 214V110l112-70 112 70v104z" />
        <path d="M48 110h224M160 40v174" strokeWidth="0.75" />
        <path d="M78 214v-64h40v64M196 132h48v40h-48z" />
        <path d="M48 228h224M48 224v8M272 224v8" strokeWidth="0.5" />
      </g>
    </svg>
  );
}

export default function Statement() {
  return (
    <StyleScope styleName="studio">
      <Opening
        variant="statement"
        kicker="Harbour & Pine, architects"
        title="We draw quiet houses for loud families."
        description="Small homes, extensions and huts in the Borders, drawn by hand and built with local timber."
        actions={<Button href="#/components/opening">See the work</Button>}
        media={<Elevation />}
        mediaCaption="Hut No. 3 · south elevation · 1:50"
      />
    </StyleScope>
  );
}
