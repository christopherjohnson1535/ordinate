// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '@ordinate/components/button';
import CallToAction from '@ordinate/components/call-to-action';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';

export default function Tones() {
  return (
    <StyleScope styleName="studio">
      <SpaceBetween size="l">
        <CallToAction
          tone="accent"
          heading="Planning a house or an extension?"
          description="We take on four new projects a year. The next opening is in March."
          actions={
            <Button variant="primary" href="#/components/journey">
              Tell us about it
            </Button>
          }
        />
        <CallToAction
          tone="default"
          heading="Open studio on 14 November"
          actions={<Button href="#/components/call-to-action">Add to calendar</Button>}
        />
      </SpaceBetween>
    </StyleScope>
  );
}
