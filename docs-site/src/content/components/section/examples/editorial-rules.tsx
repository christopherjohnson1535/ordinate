// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link from '@ordinate/components/link';
import Section from '@ordinate/components/section';
import StyleScope from '@ordinate/components/style-scope';
import TextContent from '@ordinate/components/text-content';

export default function EditorialRules() {
  return (
    <StyleScope styleName="editorial">
      <Section
        rule="double"
        width="narrow"
        heading="Field notes"
        description="Short pieces from the plots, written on the day."
        actions={<Link href="#/components/section">All notes</Link>}
      >
        <TextContent>
          <p>
            The first frost came early to the north plots this year. The dahlias went black overnight, and by ten the
            whole row had been lifted, wrapped in newspaper and carried to the shed.
          </p>
          <p>
            Plot 14 is trying sweet peas sown in October for the first time. Ask Dana Ruiz in March whether it worked.
          </p>
        </TextContent>
      </Section>
      <Section rule="bottom" width="narrow" heading="From the kitchen">
        <TextContent>
          <p>Leek and potato soup, with the last of the parsley. Recipe on page 31.</p>
        </TextContent>
      </Section>
    </StyleScope>
  );
}
