// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import SiteHeader from '@ordinate/components/site-header';
import StyleScope from '@ordinate/components/style-scope';

const workshopLogo = (
  <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="6" />
    <circle cx="23" cy="21" r="6" />
    <path d="M9 21l5-10h7l2 10M14 11l-2-4h-3M21 11l-1-3h3" />
  </svg>
);

const pages = [
  { text: 'Repairs', href: '/repairs' },
  { text: 'Bikes for sale', href: '/bikes' },
  { text: 'Classes', href: '/classes' },
  { text: 'Visit', href: '/visit' },
];

export default function Shop() {
  const [path, setPath] = useState('/repairs');

  return (
    <StyleScope styleName="shopfront">
      <SiteHeader
        brand={{ name: 'Fixit Bikes', href: '/', logo: workshopLogo }}
        links={pages.map(page => ({ ...page, current: page.href === path }))}
        notice="Open today 8–6 · Same-day repairs before 10"
        actions={<Button variant="primary">Book a repair</Button>}
        onFollow={event => {
          // A router shows the page here; the site keeps its own URL.
          event.preventDefault();
          setPath(event.detail.href);
        }}
      />
      <Box padding="l" color="text-body-secondary" fontSize="body-s">
        Showing {path}
      </Box>
    </StyleScope>
  );
}
