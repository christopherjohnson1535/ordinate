// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FileUpload from '@ordinate/components/file-upload';
import FormField from '@ordinate/components/form-field';

const lastModified = new Date(2026, 9, 28, 16, 40).getTime();

// Sample files with realistic sizes, without holding that much data in memory.
function sampleFile(name: string, type: string, size: number) {
  const file = new File(['sample'], name, { type, lastModified });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

const drawingSet = [
  sampleFile('site-plan-rev-c.pdf', 'application/pdf', 1_240_512),
  sampleFile('north-elevation.pdf', 'application/pdf', 830_220),
  sampleFile('south-elevation.pdf', 'application/pdf', 812_904),
  sampleFile('section-a-a.dwg', 'application/acad', 2_402_118),
  sampleFile('section-b-b.dwg', 'application/acad', 2_115_640),
  sampleFile('roof-plan.dwg', 'application/acad', 1_502_337),
];

export default function Multiple() {
  const [value, setValue] = useState<ReadonlyArray<File>>(drawingSet);

  return (
    <FormField label="Tender drawings" description="Attach every sheet of the north annex set.">
      <FileUpload
        value={value}
        onChange={event => setValue(event.detail.value)}
        multiple={true}
        accept=".pdf,.dwg"
        showFileSize={true}
        tokenLimit={3}
        constraintText="PDF or DWG, up to 10 MB each."
        i18nStrings={{ uploadButtonText: 'Choose drawings' }}
      />
    </FormField>
  );
}
