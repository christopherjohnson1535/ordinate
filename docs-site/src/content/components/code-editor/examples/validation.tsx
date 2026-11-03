// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import CodeEditor from '@ordinate/components/code-editor';
import FormField from '@ordinate/components/form-field';

const initial = `{
  "Version": "2026-01-01",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["drawings:Read"],
      "Resource": "north-annex/*"
    }
  ]
`;

function parseError(text: string): string | undefined {
  try {
    JSON.parse(text);
    return undefined;
  } catch (error) {
    return `Enter a valid JSON document. ${(error as Error).message}`;
  }
}

export default function Validation() {
  const [policy, setPolicy] = useState(initial);
  // Checked once typing stops, so the error does not flicker on every key.
  const [error, setError] = useState(parseError(initial));

  return (
    <FormField
      label="Access policy"
      description="Who can read the north-annex drawings."
      errorText={error}
      stretch={true}
    >
      <CodeEditor
        language="json"
        value={policy}
        onChange={event => setPolicy(event.detail.value)}
        onDelayedChange={event => setError(parseError(event.detail.value))}
        editorContentHeight={220}
      />
    </FormField>
  );
}
