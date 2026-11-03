// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Multiselect, { MultiselectProps } from '@ordinate/components/multiselect';
import SpaceBetween from '@ordinate/components/space-between';

const channels: MultiselectProps.Option[] = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'Text message' },
  { value: 'pager', label: 'Pager' },
  { value: 'webhook', label: 'Webhook' },
];

export default function States() {
  const [selected, setSelected] = useState<ReadonlyArray<MultiselectProps.Option>>([]);

  return (
    <SpaceBetween size="l">
      <FormField label="Alert channels" errorText={selected.length === 0 ? 'Choose at least one channel.' : undefined}>
        <Multiselect
          options={channels}
          selectedOptions={selected}
          placeholder="Choose channels"
          keepOpen={false}
          onChange={event => setSelected(event.detail.selectedOptions)}
        />
      </FormField>
      <FormField label="Escalation channels" description="Set by the on-call policy.">
        <Multiselect options={channels} selectedOptions={[channels[2]]} readOnly={true} />
      </FormField>
      <FormField label="Archive channels" constraintText="Available on the team plan.">
        <Multiselect options={channels} selectedOptions={[]} placeholder="Choose channels" disabled={true} />
      </FormField>
    </SpaceBetween>
  );
}
