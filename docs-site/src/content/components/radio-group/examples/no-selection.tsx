// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import Form from '@ordinate/components/form';
import FormField from '@ordinate/components/form-field';
import RadioGroup from '@ordinate/components/radio-group';

export default function NoSelection() {
  const [retention, setRetention] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  const missing = submitted && retention === null;

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        setSubmitted(true);
        if (retention !== null) {
          setSaved(retention);
        }
      }}
    >
      <Form actions={<Button variant="primary">Save retention</Button>}>
        <FormField
          label="Log retention"
          description={saved ? `Saved: ${saved}.` : 'Logs older than this are deleted for good.'}
          errorText={missing ? 'Choose how long to keep logs.' : undefined}
        >
          <RadioGroup
            value={retention}
            onChange={event => setRetention(event.detail.value)}
            ariaRequired={true}
            items={[
              { value: '30 days', label: '30 days' },
              { value: '1 year', label: '1 year' },
              { value: '7 years', label: '7 years', description: 'Needed for audited projects.' },
            ]}
          />
        </FormField>
      </Form>
    </form>
  );
}
