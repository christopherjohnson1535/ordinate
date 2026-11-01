// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link from '~components/link';
import SiteFooter, { SiteFooterProps } from '~components/site-footer';
import SpaceBetween from '~components/space-between';

import { Example, ExamplePage, footerColumns, workshopBrand } from '../examples/website-samples';

const tones: SiteFooterProps.Tone[] = ['default', 'accent', 'inverted'];

const address = (
  <address style={{ fontStyle: 'normal' }}>
    12 Shore Road, Leith
    <br />
    Tuesday to Sunday, 8–6
  </address>
);

const legal = (
  <>
    <span>© 2026 Fixit Bikes</span>
    <SpaceBetween direction="horizontal" size="m">
      <Link href="#privacy">Privacy</Link>
      <Link href="#terms">Terms</Link>
    </SpaceBetween>
  </>
);

export default function SiteFooterPermutations() {
  return (
    <ExamplePage>
      {tones.map(tone => (
        <Example key={tone} title={`tone ${tone}`}>
          <SiteFooter tone={tone} brand={workshopBrand} columns={footerColumns} legal={legal}>
            {address}
          </SiteFooter>
        </Example>
      ))}
      <Example title="legal only">
        <SiteFooter legal="© 2026 Harbour & Pine" />
      </Example>
      <Example title="narrow column" narrow={true}>
        <SiteFooter brand={workshopBrand} columns={footerColumns} legal={legal}>
          {address}
        </SiteFooter>
      </Example>
    </ExamplePage>
  );
}
