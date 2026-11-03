// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';

export default function Validation() {
  const [email, setEmail] = useState('dana@annex');
  const [nodes, setNodes] = useState('64');

  const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const count = Number(nodes);
  const nodesError = nodes === '' || count < 1 ? 'Enter at least 1 node.' : undefined;
  const nodesWarning = count > 50 ? 'More than 50 nodes takes several minutes to start.' : undefined;

  return (
    <SpaceBetween size="l">
      <FormField
        label="Contact email"
        description="Where alerts are sent."
        constraintText="One address. Use a shared inbox for a team."
        errorText={emailValid ? undefined : 'Enter an email address like name@example.com.'}
      >
        <Input type="email" value={email} onChange={event => setEmail(event.detail.value)} />
      </FormField>
      <FormField
        label="Nodes"
        description="How many nodes to start with. Try 0, or more than 50."
        errorText={nodesError}
        warningText={nodesWarning}
      >
        <Input type="number" inputMode="numeric" value={nodes} onChange={event => setNodes(event.detail.value)} />
      </FormField>
    </SpaceBetween>
  );
}
