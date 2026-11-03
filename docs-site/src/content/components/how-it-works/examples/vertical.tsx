// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import HowItWorks from '@ordinate/components/how-it-works';
import Section from '@ordinate/components/section';
import StyleScope from '@ordinate/components/style-scope';

export default function Vertical() {
  return (
    <StyleScope styleName="studio">
      <Section
        width="narrow"
        spacing="small"
        heading="Working with us"
        description="From the first visit to the day you move in, a house takes us about eighteen months."
      >
        <HowItWorks
          orientation="vertical"
          steps={[
            { title: 'A visit', description: 'We walk the site with you and listen. No charge, no drawings yet.' },
            { title: 'Sketch scheme', description: 'Three ways the house could sit on the land, drawn by hand.' },
            { title: 'Planning', description: 'Full drawings for the council. Most applications take eight weeks.' },
            { title: 'Building', description: 'We visit the site every week and answer the builder’s questions.' },
            { title: 'Handover', description: 'A walk through the finished house, and a visit again a year later.' },
          ]}
        />
      </Section>
    </StyleScope>
  );
}
