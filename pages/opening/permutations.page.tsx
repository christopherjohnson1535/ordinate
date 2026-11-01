// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Opening, { OpeningProps } from '~components/opening';
import SpaceBetween from '~components/space-between';

import { BicycleDrawing, Elevation, Example, ExamplePage } from '../examples/website-samples';

const journalLinks: OpeningProps.Link[] = [
  { text: 'Essays', href: '#essays', current: true },
  { text: 'Field notes', href: '#notes' },
  { text: 'Recipes', href: '#recipes' },
  { text: 'Letters', href: '#letters' },
  { text: 'Archive', href: '#archive' },
];

const shopActions = (
  <SpaceBetween direction="horizontal" size="xs">
    <Button formAction="none" variant="primary">
      Book a repair
    </Button>
    <Button formAction="none">See prices</Button>
  </SpaceBetween>
);

function Masthead() {
  return (
    <Opening
      variant="masthead"
      meta={
        <>
          <span>Vol. 3 · No. 14</span>
          <span>Autumn 2026</span>
          <span>£6</span>
        </>
      }
      title="The Allotment"
      description="A quarterly journal of small gardens, the people who keep them and what they cook at the end of the day."
      links={journalLinks}
      headingLevel={2}
    />
  );
}

function Statement({ mediaPosition }: { mediaPosition?: OpeningProps.MediaPosition }) {
  return (
    <Opening
      variant="statement"
      kicker="Harbour & Pine, architects"
      title="We draw quiet houses for loud families."
      description="Small homes, extensions and huts in the Borders, drawn by hand and built with local timber."
      actions={<Button formAction="none">See the work</Button>}
      media={<Elevation />}
      mediaCaption="Hut No. 3 · south elevation · 1:50"
      mediaPosition={mediaPosition}
      headingLevel={2}
    />
  );
}

function Split({ mediaPosition }: { mediaPosition?: OpeningProps.MediaPosition }) {
  return (
    <Opening
      variant="split"
      badge="Open Sundays"
      kicker="Bicycle repairs in Leith"
      title="Back on the road by teatime."
      description="Punctures, brakes and full services. Drop it off before ten and most bikes are ready the same day."
      actions={shopActions}
      media={<BicycleDrawing />}
      mediaPosition={mediaPosition}
      headingLevel={2}
    />
  );
}

export default function OpeningPermutations() {
  return (
    <ExamplePage>
      <Example title="variant masthead">
        <Masthead />
      </Example>
      <Example title="variant statement">
        <Statement />
      </Example>
      <Example title="variant statement, media at the start">
        <Statement mediaPosition="start" />
      </Example>
      <Example title="variant split">
        <Split />
      </Example>
      <Example title="variant split, media at the start">
        <Split mediaPosition="start" />
      </Example>
      <Example title="title only">
        <Opening title="Spring menu" headingLevel={2} />
      </Example>
      <Example title="masthead in a narrow column" narrow={true}>
        <Masthead />
      </Example>
      <Example title="statement in a narrow column" narrow={true}>
        <Statement />
      </Example>
      <Example title="split in a narrow column" narrow={true}>
        <Split />
      </Example>
    </ExamplePage>
  );
}
