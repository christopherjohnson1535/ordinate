// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import CallToAction from '@ordinate/components/call-to-action';
import Opening from '@ordinate/components/opening';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope, { StyleScopeProps } from '@ordinate/components/style-scope';

const styleNames: StyleScopeProps.StyleName[] = ['console', 'editorial', 'studio', 'shopfront'];

export default function StyleSwitch() {
  const [styleName, setStyleName] = useState<StyleScopeProps.StyleName>('shopfront');

  return (
    <SpaceBetween size="l">
      <SegmentedControl
        label="Style"
        selectedId={styleName}
        options={styleNames.map(name => ({ id: name, text: name }))}
        onChange={event => setStyleName(event.detail.selectedId as StyleScopeProps.StyleName)}
      />
      <StyleScope styleName={styleName} tagOverride="section" ariaLabel={`Fixit Bikes, ${styleName} style`}>
        <SpaceBetween size="l">
          <Opening
            variant="split"
            badge="Open Sundays"
            kicker="Bicycle repairs in Leith"
            title="Back on the road by teatime."
            description="Punctures, brakes and full services. Drop it off before ten and most bikes are ready the same day."
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="primary">Book a repair</Button>
                <Button>See prices</Button>
              </SpaceBetween>
            }
            headingLevel={2}
          />
          <CallToAction
            tone="accent"
            heading="Bring it in before ten"
            description="Most repairs are ready the same afternoon."
            actions={<Button variant="primary">Book a slot</Button>}
            headingLevel={3}
          />
        </SpaceBetween>
      </StyleScope>
    </SpaceBetween>
  );
}
