// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FileInput from '@ordinate/components/file-input';
import FileTokenGroup from '@ordinate/components/file-token-group';
import FormField from '@ordinate/components/form-field';
import SpaceBetween from '@ordinate/components/space-between';

const lastModified = new Date(2026, 9, 28, 16, 40).getTime();
const initial = [new File(['%PDF'], 'method-statement.pdf', { type: 'application/pdf', lastModified })];

export default function WithTokens() {
  const [value, setValue] = useState<ReadonlyArray<File>>(initial);

  return (
    <FormField label="Supporting documents" constraintText="PDF, up to 10 MB each.">
      <SpaceBetween size="s">
        <FileInput value={value} onChange={event => setValue(event.detail.value)} multiple={true} accept=".pdf" />
        <FileTokenGroup
          items={value.map(file => ({ file }))}
          showFileSize={true}
          alignment="vertical"
          ariaLabel="Supporting documents"
          onDismiss={event => setValue(value.filter((_, index) => index !== event.detail.fileIndex))}
        />
      </SpaceBetween>
    </FormField>
  );
}
