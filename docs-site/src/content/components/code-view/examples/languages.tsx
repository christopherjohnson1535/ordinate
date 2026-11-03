// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import CodeView, { CodeViewProps } from '@ordinate/components/code-view';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';

const samples: Partial<Record<CodeViewProps.Language, string>> = {
  typescript: `interface Node {
  id: string;
  zone: 'us-mountain-1a' | 'us-mountain-1b';
  running: boolean;
}

export function countRunning(nodes: ReadonlyArray<Node>): number {
  return nodes.filter(node => node.running).length;
}`,
  python: `def percentile(values, p):
    """The p-th percentile, by nearest rank."""
    ordered = sorted(values)
    rank = max(0, round(p / 100 * len(ordered)) - 1)
    return ordered[rank]`,
  css: `.sheet {
  border: 2px solid var(--ink);
  padding: 24px; /* one grid unit */
}`,
  markdown: `# Runbook

1. Drain the node with **ord nodes drain**.
2. Check the [dashboard](https://example.com).`,
};

export default function Languages() {
  const [language, setLanguage] = useState<CodeViewProps.Language>('typescript');

  return (
    <SpaceBetween size="m">
      <SegmentedControl
        label="Language"
        selectedId={language}
        onChange={event => setLanguage(event.detail.selectedId as CodeViewProps.Language)}
        options={Object.keys(samples).map(id => ({ id, text: id }))}
      />
      <CodeView content={samples[language] ?? ''} language={language} ariaLabel={`Sample in ${language}`} />
    </SpaceBetween>
  );
}
