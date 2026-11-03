// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';

const limit = 64;

export default function CharacterCount() {
  const [summary, setSummary] = useState('Staging cluster for the north annex survey.');
  const left = limit - summary.length;

  return (
    <FormField
      label="Summary"
      description="One line, shown under the project name."
      characterCountText={left >= 0 ? `${left} of ${limit} characters left` : `${-left} characters over`}
      errorText={left < 0 ? 'Shorten the summary.' : undefined}
      stretch={true}
    >
      <Input value={summary} onChange={event => setSummary(event.detail.value)} />
    </FormField>
  );
}
