// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import PullQuote, { PullQuoteProps } from '@ordinate/components/pull-quote';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';

export default function Variants() {
  const [variant, setVariant] = useState<PullQuoteProps.Variant>('default');

  return (
    <SpaceBetween size="l">
      <SegmentedControl
        label="Variant"
        selectedId={variant}
        options={[
          { id: 'default', text: 'Default' },
          { id: 'hanging', text: 'Hanging' },
          { id: 'ruled', text: 'Ruled' },
        ]}
        onChange={event => setVariant(event.detail.selectedId as PullQuoteProps.Variant)}
      />
      <StyleScope styleName="editorial">
        <PullQuote variant={variant} attribution="Tomás Reyes, sail maker">
          The marsh is the wall now.
        </PullQuote>
      </StyleScope>
    </SpaceBetween>
  );
}
