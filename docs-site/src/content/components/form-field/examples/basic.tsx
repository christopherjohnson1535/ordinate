// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import Link from '@ordinate/components/link';
import SpaceBetween from '@ordinate/components/space-between';

export default function Basic() {
  const [name, setName] = useState('north-annex');
  const [owner, setOwner] = useState('Dana Ruiz');

  return (
    <SpaceBetween size="l">
      <FormField
        label="Project name"
        info={<Link variant="info">Info</Link>}
        description="Shown in the console and on invoices."
        constraintText="Lowercase letters, numbers and hyphens."
      >
        <Input value={name} onChange={event => setName(event.detail.value)} />
      </FormField>
      <FormField label="Owner" description="Gets alerts for this project.">
        <Input value={owner} onChange={event => setOwner(event.detail.value)} />
      </FormField>
    </SpaceBetween>
  );
}
