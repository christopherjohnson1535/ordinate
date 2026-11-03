// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import PullQuote from '@ordinate/components/pull-quote';
import StyleScope from '@ordinate/components/style-scope';

export default function StudioStatement() {
  return (
    <StyleScope styleName="studio">
      <PullQuote variant="ruled">
        <p>A house should be quiet enough to hear the weather.</p>
        <p>Everything else is furniture.</p>
      </PullQuote>
    </StyleScope>
  );
}
