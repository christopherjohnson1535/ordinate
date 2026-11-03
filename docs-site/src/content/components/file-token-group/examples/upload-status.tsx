// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import FileTokenGroup, { FileTokenGroupProps } from '@ordinate/components/file-token-group';
import SpaceBetween from '@ordinate/components/space-between';

const lastModified = new Date(2026, 9, 28, 16, 40).getTime();
const file = (name: string, type: string) => new File(['sample'], name, { type, lastModified });

const uploading: FileTokenGroupProps.Item[] = [
  { file: file('site-plan-rev-c.pdf', 'application/pdf'), loading: true },
  { file: file('south-elevation.dwg', 'application/acad'), loading: true },
  { file: file('roof-detail.svg', 'image/svg+xml'), loading: true },
];

// What the server answered for each file.
const finished: FileTokenGroupProps.Item[] = [
  { file: uploading[0].file },
  { file: uploading[1].file, errorText: 'Upload failed. Check the connection and try again.' },
  { file: uploading[2].file, warningText: 'Vector images are converted to PDF on upload.' },
];

export default function UploadStatus() {
  const [items, setItems] = useState(uploading);
  const done = items.every(item => !item.loading);

  return (
    <SpaceBetween size="m">
      <FileTokenGroup
        items={items}
        alignment="vertical"
        showFileThumbnail={true}
        ariaLabel="Uploads"
        onDismiss={event => setItems(current => current.filter((_, index) => index !== event.detail.fileIndex))}
      />
      <Button onClick={() => setItems(done ? uploading : finished)}>{done ? 'Upload again' : 'Finish uploads'}</Button>
    </SpaceBetween>
  );
}
