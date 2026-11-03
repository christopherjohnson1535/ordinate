// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Link from '@ordinate/components/link';
import SiteFooter, { SiteFooterProps } from '@ordinate/components/site-footer';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';

const columns: SiteFooterProps.Column[] = [
  {
    title: 'Visit',
    links: [
      { text: 'Opening hours', href: '#/components/opening-hours' },
      { text: 'Find the workshop', href: 'https://example.com/map' },
      { text: 'Parking and bike racks', href: 'https://example.com/parking' },
    ],
  },
  {
    title: 'Workshop',
    links: [
      { text: 'Repairs and prices', href: 'https://example.com/prices' },
      { text: 'Bikes for sale', href: 'https://example.com/bikes' },
      { text: 'Evening classes', href: 'https://example.com/classes' },
    ],
  },
  {
    title: 'About',
    links: [
      { text: 'Our story', href: 'https://example.com/story' },
      { text: 'Jobs', href: 'https://example.com/jobs' },
      { text: 'Contact', href: 'https://example.com/contact' },
    ],
  },
];

export default function Columns() {
  return (
    <StyleScope styleName="shopfront">
      <SiteFooter
        brand={{ name: 'Fixit Bikes', href: 'https://example.com' }}
        columns={columns}
        legal={
          <SpaceBetween direction="horizontal" size="m">
            <span>© 2026 Fixit Bikes</span>
            <Link href="https://example.com/privacy">Privacy</Link>
            <Link href="https://example.com/terms">Terms</Link>
          </SpaceBetween>
        }
      >
        <Box variant="p">
          12 Shore Road, Leith
          <br />
          Tuesday to Sunday, 8–6
        </Box>
      </SiteFooter>
    </StyleScope>
  );
}
