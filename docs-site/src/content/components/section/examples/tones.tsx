// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Link from '@ordinate/components/link';
import Section from '@ordinate/components/section';
import StyleScope from '@ordinate/components/style-scope';

export default function Tones() {
  return (
    <StyleScope styleName="shopfront">
      <Section
        heading="Repairs while you wait"
        description="Punctures, brakes and gears, fixed by people who ride every day."
        spacing="small"
      >
        <Box variant="p">
          Bring your bike in before ten and most repairs are ready the same afternoon.{' '}
          <Link href="#/components/section">Every price is on the board</Link> by the door.
        </Box>
      </Section>
      <Section
        tone="accent"
        width="narrow"
        spacing="small"
        heading="Evening classes"
        description="Learn to fix your own bike on Tuesday evenings. Tools, tea and a stand each."
      >
        <Box variant="p">
          Four weeks, six people, one mechanic. We start with punctures and finish with a full strip-down of a hub.
        </Box>
      </Section>
      <Section
        tone="inverted"
        rule="double"
        spacing="small"
        heading="Thirty years on Shore Road"
        description="Started by two couriers in a lock-up, now a workshop of six."
        actions={<Button href="#/components/section">Our story</Button>}
      >
        <Box variant="p">
          We still fix the bikes of the couriers who taught us. <Link href="#/components/section">Read how it started</Link>.
        </Box>
      </Section>
    </StyleScope>
  );
}
