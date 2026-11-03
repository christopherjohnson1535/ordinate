// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';

export default function Types() {
  const [email, setEmail] = useState('dana.ruiz@example.com');
  const [nodes, setNodes] = useState('4');
  const [ratio, setRatio] = useState('0.25');
  const [password, setPassword] = useState('');

  return (
    <SpaceBetween size="l">
      <FormField label="Email">
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={event => setEmail(event.detail.value)}
        />
      </FormField>
      <FormField label="Nodes" constraintText="In steps of 2.">
        <Input
          type="number"
          inputMode="numeric"
          step={2}
          value={nodes}
          onChange={event => setNodes(event.detail.value)}
        />
      </FormField>
      <FormField label="Sample ratio">
        <Input
          type="number"
          inputMode="decimal"
          step="any"
          value={ratio}
          onChange={event => setRatio(event.detail.value)}
        />
      </FormField>
      <FormField label="Database password">
        <Input
          type="password"
          autoComplete="new-password"
          spellcheck={false}
          value={password}
          onChange={event => setPassword(event.detail.value)}
        />
      </FormField>
    </SpaceBetween>
  );
}
