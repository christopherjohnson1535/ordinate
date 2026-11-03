// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';

export default function Basic() {
  const [name, setName] = useState('north-annex-web');

  return (
    <FormField label="Service name" constraintText="Lowercase letters, numbers and hyphens.">
      <Input
        value={name}
        placeholder="survey-api"
        disableBrowserAutocorrect={true}
        spellcheck={false}
        onChange={event => setName(event.detail.value)}
      />
    </FormField>
  );
}
