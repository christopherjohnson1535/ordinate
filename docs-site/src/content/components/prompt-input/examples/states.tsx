// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Form from '@ordinate/components/form';
import FormField from '@ordinate/components/form-field';
import PromptInput from '@ordinate/components/prompt-input';

const limit = 120;

export default function States() {
  const [command, setCommand] = useState('restart atrium-api --region us-mountain-1 --all-nodes');
  const tooLong = command.length > limit;
  const touchesProduction = /--all-nodes/.test(command);

  return (
    <Form>
      <FormField
        label="Command"
        errorText={tooLong ? `Shorten the command to ${limit} characters or fewer.` : undefined}
        warningText={touchesProduction ? 'This restarts every node at once. Traffic drops while they start.' : undefined}
      >
        <PromptInput
          value={command}
          onChange={event => setCommand(event.detail.value)}
          actionButtonIconName="arrow-right"
          actionButtonAriaLabel="Run command"
          disableActionButton={tooLong || command.trim() === ''}
        />
      </FormField>
      <FormField label="Generated prompt" description="Written from the incident template.">
        <PromptInput value="Summarise incident 2026-118 for the north-annex team." readOnly={true} />
      </FormField>
      <FormField label="Follow-up" description="Available once the assistant has replied.">
        <PromptInput value="" placeholder="Ask a follow-up question" disabled={true} />
      </FormField>
    </Form>
  );
}
