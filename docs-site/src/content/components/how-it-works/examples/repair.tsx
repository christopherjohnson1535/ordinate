// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import HowItWorks from '@ordinate/components/how-it-works';
import Section from '@ordinate/components/section';
import StyleScope from '@ordinate/components/style-scope';

export default function Repair() {
  return (
    <StyleScope styleName="shopfront">
      <Section heading="How a repair works" spacing="small">
        <HowItWorks
          steps={[
            { title: 'Book a slot', description: 'Pick a time online or call the shop. Same-week slots most weeks.' },
            { title: 'Get a quote', description: 'We check the bike with you and price the work before we start.' },
            { title: 'Ride home', description: 'Most repairs are done the same day. We text you when it is ready.' },
          ]}
        />
      </Section>
    </StyleScope>
  );
}
