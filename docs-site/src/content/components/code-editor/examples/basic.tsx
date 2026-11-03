// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import CodeEditor, { CodeEditorProps } from '@ordinate/components/code-editor';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';

const service = `service: survey-api
image: survey-api:v7
region: us-mountain-1
nodes:
  min: 4
  max: 8   # keep headroom for month-end reports
rollout:
  maxUnavailable: 0
  maxSurge: 1
`;

export default function Basic() {
  const [value, setValue] = useState(service);
  const [preferences, setPreferences] = useState<CodeEditorProps.Preferences>({ wrapLines: true, theme: 'auto' });
  const [height, setHeight] = useState(240);
  const [savedAt, setSavedAt] = useState('');

  return (
    <SpaceBetween size="s">
      <FormField label="Service definition" description="Saved as a draft when you stop typing." stretch={true}>
        <CodeEditor
          language="yaml"
          value={value}
          onChange={event => setValue(event.detail.value)}
          onDelayedChange={() => setSavedAt(new Date().toLocaleTimeString())}
          preferences={preferences}
          onPreferencesChange={event => setPreferences(event.detail)}
          editorContentHeight={height}
          onEditorContentResize={event => setHeight(event.detail.height)}
        />
      </FormField>
      <Box color="text-body-secondary" fontSize="body-s">
        {savedAt ? `Draft saved at ${savedAt}.` : 'No changes yet.'} Height {height} px.
      </Box>
    </SpaceBetween>
  );
}
