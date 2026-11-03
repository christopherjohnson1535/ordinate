// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import CallToAction from '@ordinate/components/call-to-action';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState('');
  const [error, setError] = useState('');

  const subscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter an email address, such as dana@example.com.');
      return;
    }
    setError('');
    setSubscribed(email);
    setEmail('');
  };

  return (
    <StyleScope styleName="editorial">
      <CallToAction
        heading="The Thursday letter"
        description={
          subscribed
            ? `Thank you. The next letter goes to ${subscribed} on Thursday.`
            : 'One garden, one recipe and one job for the weekend.'
        }
      >
        <form onSubmit={subscribe} noValidate={true}>
          <SpaceBetween direction="horizontal" size="xs" alignItems="end">
            <FormField label="Email address" errorText={error}>
              <Input type="email" value={email} onChange={event => setEmail(event.detail.value)} />
            </FormField>
            <Button variant="primary">Subscribe</Button>
          </SpaceBetween>
        </form>
      </CallToAction>
    </StyleScope>
  );
}
