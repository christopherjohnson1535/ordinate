// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import CodeView from '@ordinate/components/code-view';

const config = `{
  "project": "north-annex",
  "region": "us-mountain-1",
  "nodes": 5,
  "image": "base-2026.11",
  "maintenanceWindow": "Sun 02:00-04:00 UTC"
}
`;

export default function HighlightedLines() {
  return (
    <CodeView
      content={config}
      language="json"
      ariaLabel="project.json, with the changed lines highlighted"
      highlightedLines={[4, 5]}
      lineNotes={[
        { line: 4, text: 'was 3' },
        { line: 5, text: 'was base-2026.10' },
      ]}
    />
  );
}
