// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useId, useState } from 'react';

import Form from '@ordinate/components/form';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';
import Toggle from '@ordinate/components/toggle';

export default function Settings() {
  const [paging, setPaging] = useState(true);
  const [digest, setDigest] = useState(false);
  const [webhook, setWebhook] = useState(false);
  const [url, setUrl] = useState('https://example.com/hooks/north-annex');
  const webhookFieldId = useId();

  return (
    <Form>
      <FormField label="Alerts" description="Applies to every service in north-annex.">
        <SpaceBetween size="s">
          <Toggle
            checked={paging}
            onChange={event => setPaging(event.detail.checked)}
            description="Calls the on-call engineer for faults."
          >
            Page on faults
          </Toggle>
          <Toggle
            checked={digest}
            onChange={event => setDigest(event.detail.checked)}
            description="One email at 08:00 with yesterday's cautions."
          >
            Daily digest
          </Toggle>
        </SpaceBetween>
      </FormField>
      <FormField label="Integrations">
        <Toggle checked={webhook} onChange={event => setWebhook(event.detail.checked)} ariaControls={webhookFieldId}>
          Send alerts to a webhook
        </Toggle>
      </FormField>
      <div id={webhookFieldId}>
        {webhook && (
          <FormField label="Webhook URL" constraintText="Must start with https://.">
            <Input type="url" value={url} onChange={event => setUrl(event.detail.value)} />
          </FormField>
        )}
      </div>
    </Form>
  );
}
