// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FileTokenGroup, { FileTokenGroupProps } from '@ordinate/components/file-token-group';

const lastModified = new Date(2026, 9, 28, 16, 40).getTime();

function sampleFile(name: string, type: string, size: number) {
  const file = new File(['sample'], name, { type, lastModified });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

const initial: FileTokenGroupProps.Item[] = [
  { file: sampleFile('site-plan-rev-c.pdf', 'application/pdf', 1_240_512) },
  { file: sampleFile('structural-calculations.xlsx', 'application/vnd.ms-excel', 86_400) },
  { file: sampleFile('north-annex-boundary-and-topographic-survey.dwg', 'application/acad', 4_302_118) },
];

export default function Basic() {
  const [items, setItems] = useState(initial);

  return (
    <FileTokenGroup
      items={items}
      showFileSize={true}
      showFileLastModified={true}
      ariaLabel="Attached files"
      onDismiss={event => setItems(current => current.filter((_, index) => index !== event.detail.fileIndex))}
    />
  );
}
