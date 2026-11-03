// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Form from '@ordinate/components/form';
import FormField from '@ordinate/components/form-field';
import Tiles, { TilesProps } from '@ordinate/components/tiles';

const plans: TilesProps.Item[] = [
  { value: 'free', label: 'Free', description: 'One project and community support.' },
  { value: 'team', label: 'Team', description: 'Up to 20 people, shared billing and audit logs.' },
  { value: 'business', label: 'Business', description: 'Single sign-on and a support plan.' },
  { value: 'enterprise', label: 'Enterprise', description: 'Dedicated hardware and a named contact.' },
];

export default function Columns() {
  const [plan, setPlan] = useState<string | null>('team');
  const [backup, setBackup] = useState<string | null>(null);

  return (
    <Form kind="configuration">
      <FormField stretch={true} label="Plan" description="Four tiles fall into two rows by default.">
        <Tiles value={plan} onChange={event => setPlan(event.detail.value)} items={plans} kind="configuration" />
      </FormField>
      <FormField stretch={true} label="Backups" constraintText={backup ? undefined : 'Choose how often to back up.'}>
        <Tiles
          value={backup}
          onChange={event => setBackup(event.detail.value)}
          columns={4}
          kind="configuration"
          items={[
            { value: 'hourly', label: 'Hourly', description: 'Kept 2 days.' },
            { value: 'daily', label: 'Daily', description: 'Kept 30 days.' },
            { value: 'weekly', label: 'Weekly', description: 'Kept a year.' },
            { value: 'none', label: 'None', description: 'Not advised.' },
          ]}
        />
      </FormField>
    </Form>
  );
}
