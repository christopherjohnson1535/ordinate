// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import ColumnLayout from '@ordinate/components/column-layout';
import Link from '@ordinate/components/link';
import Section from '@ordinate/components/section';
import StyleScope from '@ordinate/components/style-scope';

const repairs = [
  { name: 'Punctures', text: 'Inner tube, patch or tubeless plug, while you wait. From £12.' },
  { name: 'Brakes', text: 'Pads, cables and bleeds for rim and disc brakes. From £18.' },
  { name: 'Full service', text: 'Everything checked, cleaned, trued and adjusted. £75.' },
];

export default function Basic() {
  return (
    <StyleScope styleName="shopfront">
      <Section
        id="repairs"
        rule="top"
        heading="What we fix"
        description="Prices include parts we keep in stock. We always call before going over the quote."
        actions={<Link href="#/components/section">All prices</Link>}
      >
        <ColumnLayout columns={3} variant="text-grid">
          {repairs.map(repair => (
            <div key={repair.name}>
              <Box variant="h3">{repair.name}</Box>
              <Box variant="p" color="text-body-secondary">
                {repair.text}
              </Box>
            </div>
          ))}
        </ColumnLayout>
      </Section>
    </StyleScope>
  );
}
