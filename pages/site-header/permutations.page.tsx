// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import SiteHeader from '~components/site-header';

import { Example, ExamplePage, workshopBrand, workshopLinks } from '../examples/website-samples';

const bookButton = (
  <Button formAction="none" variant="primary">
    Book a repair
  </Button>
);

export default function SiteHeaderPermutations() {
  return (
    <ExamplePage>
      <Example title="brand, links, action and notice">
        <SiteHeader
          brand={workshopBrand}
          links={workshopLinks}
          actions={bookButton}
          notice="Open today 8–6 · Same-day repairs before 10"
        />
      </Example>
      <Example title="brand and links">
        <SiteHeader brand={{ name: 'The Allotment', href: '#' }} links={workshopLinks.slice(0, 3)} />
      </Example>
      <Example title="brand and action only">
        <SiteHeader brand={workshopBrand} actions={bookButton} />
      </Example>
      <Example title="brand without a link">
        <SiteHeader brand={{ name: 'Harbour & Pine' }} />
      </Example>
      <Example title="narrow column: links fold into the menu" narrow={true}>
        <SiteHeader brand={workshopBrand} links={workshopLinks} actions={bookButton} notice="Open today 8–6" />
        <p style={{ margin: 0, padding: 16 }}>Open the menu: it hangs over the page below the header.</p>
      </Example>
      <Example title="sticky (scroll this frame)">
        <div style={{ blockSize: 220, overflow: 'auto' }}>
          <SiteHeader brand={workshopBrand} links={workshopLinks} actions={bookButton} sticky={true} />
          {Array.from({ length: 12 }, (_, index) => (
            <p key={index} style={{ margin: 0, padding: '8px 16px' }}>
              Line {index + 1} of the page.
            </p>
          ))}
        </div>
      </Example>
    </ExamplePage>
  );
}
