// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import FileInput from '@ordinate/components/file-input';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';

export default function Icon() {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<ReadonlyArray<File>>([]);

  return (
    <SpaceBetween size="xs">
      <SpaceBetween direction="horizontal" size="xs" alignItems="center">
        <Input
          value={message}
          onChange={event => setMessage(event.detail.value)}
          placeholder="Reply to Dana Ruiz"
          ariaLabel="Reply"
        />
        <FileInput
          variant="icon"
          ariaLabel="Attach files"
          multiple={true}
          value={files}
          onChange={event => setFiles(event.detail.value)}
        />
      </SpaceBetween>
      <Box color="text-body-secondary" fontSize="body-s">
        {files.length === 0 ? 'No attachments' : `${files.length} attached: ${files.map(file => file.name).join(', ')}`}
      </Box>
    </SpaceBetween>
  );
}
