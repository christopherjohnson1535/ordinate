// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Autosuggest, { AutosuggestProps } from '@ordinate/components/autosuggest';
import FormField from '@ordinate/components/form-field';

const hosts: AutosuggestProps.Options = [
  { value: 'survey-api.us-mountain-1.internal', label: 'survey-api', description: 'us-mountain-1' },
  { value: 'survey-worker.us-mountain-1.internal', label: 'survey-worker', description: 'us-mountain-1' },
  { value: 'drawings-store.us-coast-2.internal', label: 'drawings-store', description: 'us-coast-2' },
  { value: 'billing-export.eu-north-1.internal', label: 'billing-export', description: 'eu-north-1' },
];

export default function Basic() {
  const [host, setHost] = useState('');

  return (
    <FormField label="Upstream host" description="Pick a known service, or type any host name.">
      <Autosuggest
        value={host}
        options={hosts}
        placeholder="survey-api.us-mountain-1.internal"
        enteredTextLabel={text => `Use "${text}"`}
        empty="No services match"
        onChange={event => setHost(event.detail.value)}
      />
    </FormField>
  );
}
