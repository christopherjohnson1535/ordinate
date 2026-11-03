// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Form from '@ordinate/components/form';
import FormField from '@ordinate/components/form-field';
import RadioGroup from '@ordinate/components/radio-group';

export default function States() {
  const [plan, setPlan] = useState<string | null>('team');

  return (
    <Form>
      <FormField label="Plan">
        <RadioGroup
          value={plan}
          onChange={event => setPlan(event.detail.value)}
          items={[
            { value: 'free', label: 'Free', description: 'One project and community support.' },
            { value: 'team', label: 'Team', description: 'Up to 20 people and shared billing.' },
            {
              value: 'enterprise',
              label: 'Enterprise',
              description: 'Ask your account manager to upgrade.',
              disabled: true,
            },
          ]}
        />
      </FormField>
      <FormField label="Data residency" description="Set by your organization. Ask Dana Ruiz to change it.">
        <RadioGroup
          value="us"
          readOnly={true}
          items={[
            { value: 'us', label: 'United States' },
            { value: 'eu', label: 'European Union' },
          ]}
        />
      </FormField>
    </Form>
  );
}
