// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';

export default function States() {
  const [host, setHost] = useState('survey-api.internal');
  const [port, setPort] = useState('70000');

  const portNumber = Number(port);
  const portValid = Number.isInteger(portNumber) && portNumber >= 1 && portNumber <= 65535;

  return (
    <SpaceBetween size="l">
      <FormField label="Region" description="Set by your organization.">
        <Input value="us-mountain-1" readOnly={true} />
      </FormField>
      <FormField label="Billing account" constraintText="Not available on the free plan.">
        <Input value="" placeholder="No billing account" disabled={true} />
      </FormField>
      <FormField
        label="Host"
        warningText={
          host.endsWith('.internal') ? 'Hosts ending in .internal are not reachable from outside.' : undefined
        }
      >
        <Input value={host} onChange={event => setHost(event.detail.value)} />
      </FormField>
      <FormField label="Port" errorText={portValid ? undefined : 'Enter a port from 1 to 65535.'}>
        <Input type="number" inputMode="numeric" value={port} onChange={event => setPort(event.detail.value)} />
      </FormField>
    </SpaceBetween>
  );
}
