// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Textarea from '@ordinate/components/textarea';

export default function Code() {
  const [script, setScript] = useState(
    '#!/bin/sh\nset -e\necho "warming cache for atrium-api"\n./warm-cache --region us-mountain-1'
  );
  const [savedAt, setSavedAt] = useState<string | null>(null);

  return (
    <FormField
      label="Startup script"
      description="Runs on each node before it takes traffic. Press Ctrl+Enter to save."
      constraintText={savedAt ? `Saved at ${savedAt}.` : 'Not saved yet.'}
    >
      <Textarea
        value={script}
        onChange={event => setScript(event.detail.value)}
        rows={6}
        spellcheck={false}
        disableBrowserAutocorrect={true}
        onKeyDown={event => {
          if (event.detail.key === 'Enter' && (event.detail.ctrlKey || event.detail.metaKey)) {
            event.preventDefault();
            setSavedAt(new Date().toLocaleTimeString());
          }
        }}
      />
    </FormField>
  );
}
