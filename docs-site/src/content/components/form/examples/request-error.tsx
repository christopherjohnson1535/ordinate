// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import Form from '@ordinate/components/form';
import FormField from '@ordinate/components/form-field';
import Header from '@ordinate/components/header';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';

export default function RequestError() {
  const [address, setAddress] = useState('alerts@north-annex.example.com');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const save = () => {
    setSaving(true);
    setError(undefined);
    // The request fails every time, to show the error.
    window.setTimeout(() => {
      setSaving(false);
      setError('The settings were not saved because us-mountain-1 did not respond. Try again in a few minutes.');
    }, 1200);
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        save();
      }}
    >
      <Form
        kind="configuration"
        reference="C2"
        header={<Header variant="h2">Alert settings</Header>}
        errorText={error}
        errorIconAriaLabel="Error"
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button formAction="none" variant="link" onClick={() => setError(undefined)}>
              Cancel
            </Button>
            <Button variant="primary" loading={saving} loadingText="Saving settings">
              Save settings
            </Button>
          </SpaceBetween>
        }
      >
        <FormField label="Alert address" description="Gets a message when a service stops.">
          <Input type="email" value={address} onChange={event => setAddress(event.detail.value)} />
        </FormField>
      </Form>
    </form>
  );
}
