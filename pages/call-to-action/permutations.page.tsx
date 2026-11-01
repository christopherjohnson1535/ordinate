// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import CallToAction, { CallToActionProps } from '~components/call-to-action';
import FormField from '~components/form-field';
import Input from '~components/input';
import SpaceBetween from '~components/space-between';

import { Example, ExamplePage } from '../examples/website-samples';

const tones: CallToActionProps.Tone[] = ['inverted', 'accent', 'default'];

const actions = (
  <SpaceBetween direction="horizontal" size="xs">
    <Button formAction="none" variant="primary">
      Book a repair
    </Button>
    <Button formAction="none">Call the workshop</Button>
  </SpaceBetween>
);

function SignUp() {
  const [email, setEmail] = React.useState('');
  return (
    <form onSubmit={event => event.preventDefault()}>
      <SpaceBetween direction="horizontal" size="xs" alignItems="end">
        <FormField label="Email address">
          <Input type="email" value={email} onChange={event => setEmail(event.detail.value)} />
        </FormField>
        <Button variant="primary">Subscribe</Button>
      </SpaceBetween>
    </form>
  );
}

export default function CallToActionPermutations() {
  return (
    <ExamplePage>
      {tones.map(tone => (
        <Example key={tone} title={`tone ${tone}`}>
          <CallToAction
            tone={tone}
            heading="Bring it in before ten"
            description="Most repairs are ready the same afternoon."
            actions={actions}
          />
        </Example>
      ))}
      <Example title="inline sign-up form">
        <CallToAction heading="The Thursday letter" description="One garden, one recipe and one job for the weekend.">
          <SignUp />
        </CallToAction>
      </Example>
      <Example title="heading only">
        <CallToAction heading="Open Sundays from May" tone="accent" actions={<Button>See opening hours</Button>} />
      </Example>
      <Example title="narrow column" narrow={true}>
        <CallToAction
          heading="Bring it in before ten"
          description="Most repairs are ready the same afternoon."
          actions={actions}
        />
      </Example>
      <Example title="narrow column with a form" narrow={true}>
        <CallToAction heading="The Thursday letter" tone="accent">
          <SignUp />
        </CallToAction>
      </Example>
    </ExamplePage>
  );
}
