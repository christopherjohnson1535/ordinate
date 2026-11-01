// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Link from '~components/link';
import Section, { SectionProps } from '~components/section';
import SpaceBetween from '~components/space-between';

import { Example, ExamplePage } from '../examples/website-samples';

const tones: SectionProps.Tone[] = ['default', 'accent', 'inverted'];
const widths: SectionProps.Width[] = ['narrow', 'default', 'wide', 'full'];
const rules: SectionProps.Rule[] = ['top', 'bottom', 'double'];
const spacings: SectionProps.Spacing[] = ['none', 'small', 'default', 'large'];

const body = (
  <p style={{ margin: 0 }}>
    Bring your bike in before ten and most repairs are ready the same afternoon. We quote before we start, and{' '}
    <Link href="#prices">every price is on the board</Link> by the door.
  </p>
);

const actions = (
  <SpaceBetween direction="horizontal" size="xs">
    <Button formAction="none">See prices</Button>
    <Button formAction="none" variant="primary">
      Book a repair
    </Button>
  </SpaceBetween>
);

export default function SectionPermutations() {
  return (
    <ExamplePage>
      {tones.map(tone => (
        <Example key={tone} title={`tone ${tone}`}>
          <Section
            tone={tone}
            heading="Repairs while you wait"
            description="Punctures, brakes and gears, fixed by people who ride every day."
            actions={actions}
            headingLevel={2}
          >
            {body}
          </Section>
        </Example>
      ))}
      {rules.map(rule => (
        <Example key={rule} title={`rule ${rule}`}>
          <Section rule={rule} heading="Field notes" description="Short pieces from the plots, written on the day.">
            {body}
          </Section>
        </Example>
      ))}
      {widths.map(width => (
        <Example key={width} title={`width ${width}`}>
          <Section width={width} tone="accent" spacing="small" heading={`Width ${width}`}>
            {body}
          </Section>
        </Example>
      ))}
      {spacings.map(spacing => (
        <Example key={spacing} title={`spacing ${spacing}`}>
          <Section spacing={spacing} tone="accent" heading={`Spacing ${spacing}`} />
        </Example>
      ))}
      <Example title="content only">
        <Section>{body}</Section>
      </Example>
      <Example title="inverted, in a narrow column" narrow={true}>
        <Section
          tone="inverted"
          rule="double"
          heading="The studio"
          description="Two architects and a model maker, above the bakery on Wester Road."
          actions={<Button formAction="none">Meet us</Button>}
        >
          {body}
        </Section>
      </Example>
    </ExamplePage>
  );
}
