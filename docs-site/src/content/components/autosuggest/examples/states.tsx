// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Autosuggest, { AutosuggestProps } from '@ordinate/components/autosuggest';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';

const zones: AutosuggestProps.Options = [
  { value: 'us-mountain-1a' },
  { value: 'us-mountain-1b' },
  { value: 'us-coast-2a', labelTag: 'retiring' },
];

export default function States() {
  const [zone, setZone] = useState('us-coast-2a');
  const [backup, setBackup] = useState('');
  const [attempt, setAttempt] = useState(0);

  return (
    <SpaceBetween size="l">
      <FormField
        label="Zone"
        warningText={zone === 'us-coast-2a' ? 'us-coast-2a is retiring in March. Choose another zone.' : undefined}
      >
        <Autosuggest value={zone} options={zones} onChange={event => setZone(event.detail.value)} />
      </FormField>
      <FormField label="Backup zone" constraintText={attempt > 0 ? `Tried ${attempt} times.` : undefined}>
        <Autosuggest
          value={backup}
          options={[]}
          placeholder="Find a zone"
          statusType="error"
          errorText="The zone list could not be loaded."
          recoveryText="Retry"
          onChange={event => setBackup(event.detail.value)}
          onLoadItems={event => {
            if (event.detail.samePage) {
              setAttempt(attempt + 1);
            }
          }}
        />
      </FormField>
      <FormField label="Home zone" description="Set when the project was created.">
        <Autosuggest value="us-mountain-1a" options={zones} readOnly={true} />
      </FormField>
    </SpaceBetween>
  );
}
