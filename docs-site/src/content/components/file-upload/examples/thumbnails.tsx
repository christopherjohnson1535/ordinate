// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FileUpload from '@ordinate/components/file-upload';
import FormField from '@ordinate/components/form-field';

const lastModified = new Date(2026, 9, 30, 11, 5).getTime();

// Small drawings stand in for photos, so the example needs no image files.
function sketch(name: string, stroke: string, path: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#f4f6fa"/><path d="${path}" fill="none" stroke="${stroke}" stroke-width="2"/></svg>`;
  return new File([svg], name, { type: 'image/svg+xml', lastModified });
}

const photos = [
  sketch('crack-east-wall.svg', '#8a2b2b', 'M8 8 20 22 16 34 30 44 28 56'),
  sketch('damp-patch-cellar.svg', '#1b4f9c', 'M14 32a18 14 0 1 0 36 0a18 14 0 1 0-36 0'),
  new File(['%PDF'], 'surveyor-notes.pdf', { type: 'application/pdf', lastModified }),
];

export default function Thumbnails() {
  const [value, setValue] = useState<ReadonlyArray<File>>(photos);

  return (
    <FormField label="Defect photos" description="Show where the defect is and how large it is.">
      <FileUpload
        value={value}
        onChange={event => setValue(event.detail.value)}
        multiple={true}
        accept="image/*,.pdf"
        showFileThumbnail={true}
        showFileLastModified={true}
        constraintText="Images or PDF."
        i18nStrings={{ uploadButtonText: 'Add photos' }}
      />
    </FormField>
  );
}
