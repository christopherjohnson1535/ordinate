// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import TreeView from '../../../lib/components/tree-view';

interface Node {
  id: string;
  children?: Node[];
}

test('renders on the server', () => {
  const html = renderToString(
    <TreeView<Node>
      items={[{ id: 'site', children: [{ id: 'annex' }] }, { id: 'yard' }]}
      getItemId={item => item.id}
      getItemChildren={item => item.children}
      renderItem={item => ({ content: item.id })}
      expandedItems={['site']}
      ariaLabel="Locations"
    />
  );
  expect(html).toContain('role="tree"');
  expect(html).toContain('role="group"');
  expect(html).toContain('annex');
  expect(html).toContain('aria-label="Collapse site"');
});
