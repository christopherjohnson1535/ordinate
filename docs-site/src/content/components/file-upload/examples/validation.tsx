// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FileUpload from '@ordinate/components/file-upload';
import FormField from '@ordinate/components/form-field';

const maxSize = 10_000_000;
const lastModified = new Date(2026, 9, 28, 16, 40).getTime();

function sampleFile(name: string, type: string, size: number) {
  const file = new File(['sample'], name, { type, lastModified });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

const initial = [
  sampleFile('site-plan-rev-c.pdf', 'application/pdf', 1_240_512),
  sampleFile('boundary-and-topographic-survey.dwg', 'application/acad', 48_302_118),
  sampleFile('north-elevation.svg', 'image/svg+xml', 64_800),
];

export default function Validation() {
  const [value, setValue] = useState<ReadonlyArray<File>>(initial);

  const fileErrors = value.map(file => (file.size > maxSize ? 'Larger than 10 MB. Compress it or split it.' : null));
  const fileWarnings = value.map(file =>
    file.type === 'image/svg+xml' ? 'Vector images are converted to PDF on upload.' : null
  );
  const errorCount = fileErrors.filter(Boolean).length;

  return (
    <FormField
      label="Drawing set"
      description="The signed set for the north annex."
      errorText={errorCount > 0 ? `${errorCount} of ${value.length} files cannot be uploaded.` : undefined}
    >
      <FileUpload
        value={value}
        onChange={event => setValue(event.detail.value)}
        multiple={true}
        accept=".pdf,.dwg,.svg"
        showFileSize={true}
        fileErrors={fileErrors}
        fileWarnings={fileWarnings}
        constraintText="PDF, DWG or SVG, up to 10 MB each."
      />
    </FormField>
  );
}
