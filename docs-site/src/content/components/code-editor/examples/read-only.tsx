// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import Button from '@ordinate/components/button';
import CodeEditor from '@ordinate/components/code-editor';
import SpaceBetween from '@ordinate/components/space-between';

const generated = `# Generated from survey-api. Do not edit.
upstream survey_api {
  server survey-api-1.us-mountain-1.internal:8080;
  server survey-api-2.us-mountain-1.internal:8080;
}
`;

export default function ReadOnly() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      return;
    }
    const timer = window.setTimeout(() => setLoading(false), 1500);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <SpaceBetween size="m">
      <Button formAction="none" iconName="refresh" disabled={loading} onClick={() => setLoading(true)}>
        Reload configuration
      </Button>
      <CodeEditor
        ariaLabel="Generated proxy configuration"
        language="text"
        languageLabel="nginx"
        value={generated}
        readOnly={true}
        loading={loading}
        preferences={{ wrapLines: false, theme: 'dark', showGutter: false }}
        editorContentHeight={140}
      />
    </SpaceBetween>
  );
}
