// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Form from '@ordinate/components/form';
import FormField from '@ordinate/components/form-field';
import Textarea from '@ordinate/components/textarea';

export default function States() {
  const [comment, setComment] = useState('Looks fine. TODO: check the retry limit before this ships.');
  const hasTodo = /TODO/.test(comment);

  return (
    <Form>
      <FormField
        label="Review comment"
        warningText={hasTodo ? 'The comment has a TODO. Resolve it or open a ticket.' : undefined}
      >
        <Textarea
          value={comment}
          onChange={event => setComment(event.detail.value)}
          warning={hasTodo}
          rows={2}
          resize="none"
        />
      </FormField>
      <FormField label="Audit entry" description="Written by the system.">
        <Textarea
          value="Created by Dana Ruiz on 2026-10-31 at 14:02 from the north-annex template."
          readOnly={true}
          rows={2}
        />
      </FormField>
      <FormField label="Billing notes" description="Available on the Team plan.">
        <Textarea value="" placeholder="Notes for the invoice" disabled={true} rows={2} />
      </FormField>
    </Form>
  );
}
