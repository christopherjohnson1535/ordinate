// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import Form from '@ordinate/components/form';
import FormField from '@ordinate/components/form-field';
import Header from '@ordinate/components/header';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';

export default function Kinds() {
  const [days, setDays] = useState('90');

  return (
    <form onSubmit={event => event.preventDefault()}>
      <Form
        variant="embedded"
        kind="policy"
        reference="P1"
        header={
          <Header variant="h3" description="Applies to every bucket in north-annex.">
            Retention rule
          </Header>
        }
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button formAction="none" variant="link">
              Cancel
            </Button>
            <Button variant="primary">Save rule</Button>
          </SpaceBetween>
        }
      >
        <FormField label="Keep drawings for" constraintText="Days, from 1 to 3650.">
          <Input type="number" inputMode="numeric" value={days} onChange={event => setDays(event.detail.value)} />
        </FormField>
      </Form>
    </form>
  );
}
