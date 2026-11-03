// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FileTokenGroup, { FileTokenGroupProps } from '@ordinate/components/file-token-group';

const lastModified = new Date(2026, 9, 28, 16, 40).getTime();

const names = [
  'ground-floor-plan.pdf',
  'first-floor-plan.pdf',
  'roof-plan.pdf',
  'north-elevation.pdf',
  'south-elevation.pdf',
  'east-elevation.pdf',
  'west-elevation.pdf',
  'section-a-a.pdf',
];

const initial: FileTokenGroupProps.Item[] = names.map(name => ({
  file: new File(['%PDF'], name, { type: 'application/pdf', lastModified }),
}));

export default function Limit() {
  const [items, setItems] = useState(initial);

  return (
    <FileTokenGroup
      items={items}
      limit={4}
      ariaLabel="Drawing sheets"
      onDismiss={event => setItems(current => current.filter((_, index) => index !== event.detail.fileIndex))}
    />
  );
}
