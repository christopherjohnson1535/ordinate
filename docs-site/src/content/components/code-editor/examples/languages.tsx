// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import CodeEditor from '@ordinate/components/code-editor';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';

type Language = 'typescript' | 'python' | 'json';

const samples: Record<Language, string> = {
  typescript: `interface Node {
  id: string;
  zone: 'us-mountain-1a' | 'us-mountain-1b';
  healthy: boolean;
}

export function countHealthy(nodes: ReadonlyArray<Node>): number {
  return nodes.filter(node => node.healthy).length;
}
`,
  python: `def floor_area(width: float, depth: float) -> float:
    """Returns the floor area of a room in square meters."""
    if width <= 0 or depth <= 0:
        raise ValueError("dimensions must be positive")
    return round(width * depth, 2)
`,
  json: `{
  "project": "north-annex",
  "owner": "Dana Ruiz",
  "regions": ["us-mountain-1", "us-coast-2"],
  "retentionDays": 90
}
`,
};

const labels: Record<Language, string> = { typescript: 'TypeScript', python: 'Python', json: 'JSON' };

export default function Languages() {
  const [language, setLanguage] = useState<Language>('typescript');
  const [values, setValues] = useState(samples);

  return (
    <SpaceBetween size="m">
      <SegmentedControl
        label="Language"
        selectedId={language}
        options={(Object.keys(samples) as Language[]).map(id => ({ id, text: labels[id] }))}
        onChange={event => setLanguage(event.detail.selectedId as Language)}
      />
      <CodeEditor
        ariaLabel={`${labels[language]} source`}
        language={language}
        value={values[language]}
        onChange={event => setValues(current => ({ ...current, [language]: event.detail.value }))}
        editorContentHeight={220}
      />
    </SpaceBetween>
  );
}
