// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Form from '@ordinate/components/form';
import FormField from '@ordinate/components/form-field';
import PromptInput from '@ordinate/components/prompt-input';

export default function Rows() {
  const [query, setQuery] = useState('');
  const [task, setTask] = useState(
    'Draft the change notice for north-annex.\nList the drawings that move to revision C.\nNote who signs off.'
  );

  return (
    <Form>
      <FormField label="Query" description="One line, grows to three, then scrolls.">
        <PromptInput
          value={query}
          onChange={event => setQuery(event.detail.value)}
          placeholder="nodes where region = us-mountain-1"
          actionButtonIconName="arrow-right"
          actionButtonAriaLabel="Run query"
          disableActionButton={query.trim() === ''}
          spellcheck={false}
          disableBrowserAutocorrect={true}
        />
      </FormField>
      <FormField label="Task" description="Starts at three lines and grows to eight.">
        <PromptInput
          value={task}
          onChange={event => setTask(event.detail.value)}
          minRows={3}
          maxRows={8}
          disableActionButton={task.trim() === ''}
        />
      </FormField>
    </Form>
  );
}
