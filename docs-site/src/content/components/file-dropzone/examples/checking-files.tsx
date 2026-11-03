// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Alert from '@ordinate/components/alert';
import Box from '@ordinate/components/box';
import FileDropzone from '@ordinate/components/file-dropzone';
import FileInput from '@ordinate/components/file-input';
import FileTokenGroup from '@ordinate/components/file-token-group';
import SpaceBetween from '@ordinate/components/space-between';

const isImage = (file: File) => file.type.startsWith('image/');

export default function CheckingFiles() {
  const [photos, setPhotos] = useState<ReadonlyArray<File>>([]);
  const [refused, setRefused] = useState<string[]>([]);

  const add = (files: ReadonlyArray<File>) => {
    setPhotos(current => [...current, ...files.filter(isImage)]);
    setRefused(files.filter(file => !isImage(file)).map(file => file.name));
  };

  return (
    <SpaceBetween size="m">
      <FileDropzone onChange={event => add(event.detail.value)}>
        <Box variant="strong">Drop site photos here</Box>
        <Box variant="small" color="text-body-secondary">
          Images only. Other files are left out.
        </Box>
        <FileInput value={[]} onChange={event => add(event.detail.value)} multiple={true} accept="image/*">
          Choose photos
        </FileInput>
      </FileDropzone>
      {refused.length > 0 && <Alert type="caution">Left out because they are not images: {refused.join(', ')}.</Alert>}
      <FileTokenGroup
        items={photos.map(file => ({ file }))}
        showFileThumbnail={true}
        ariaLabel="Site photos"
        onDismiss={event => setPhotos(current => current.filter((_, index) => index !== event.detail.fileIndex))}
      />
    </SpaceBetween>
  );
}
