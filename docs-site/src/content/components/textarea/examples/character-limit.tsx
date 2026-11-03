// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Textarea from '@ordinate/components/textarea';

const limit = 160;

export default function CharacterLimit() {
  const [summary, setSummary] = useState('Restart atrium-api nodes one at a time to pick up the new certificate.');
  const over = summary.length - limit;

  return (
    <FormField
      label="Change summary"
      description="Sent to the on-call channel when the change starts."
      characterCountText={`${summary.length} of ${limit} characters`}
      errorText={over > 0 ? `Shorten the summary by ${over} ${over === 1 ? 'character' : 'characters'}.` : undefined}
    >
      <Textarea value={summary} onChange={event => setSummary(event.detail.value)} rows={3} />
    </FormField>
  );
}
