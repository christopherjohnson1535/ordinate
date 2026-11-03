// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import FileDropzone from '@ordinate/components/file-dropzone';
import FileInput from '@ordinate/components/file-input';
import Icon from '@ordinate/components/icon';
import SpaceBetween from '@ordinate/components/space-between';

export default function Basic() {
  const [files, setFiles] = useState<ReadonlyArray<File>>([]);

  return (
    <SpaceBetween size="s">
      <FileDropzone onChange={event => setFiles(current => [...current, ...event.detail.value])}>
        <Icon name="upload" size="medium" />
        <Box variant="strong">Drop drawings here to import them</Box>
        <Box variant="small" color="text-body-secondary">
          PDF or DWG, up to 10 MB each
        </Box>
        <FileInput value={files} onChange={event => setFiles(event.detail.value)} multiple={true} accept=".pdf,.dwg">
          Choose drawings
        </FileInput>
      </FileDropzone>
      <Box color="text-body-secondary" fontSize="body-s">
        {files.length === 0 ? 'Nothing imported yet.' : `Imported: ${files.map(file => file.name).join(', ')}`}
      </Box>
    </SpaceBetween>
  );
}
