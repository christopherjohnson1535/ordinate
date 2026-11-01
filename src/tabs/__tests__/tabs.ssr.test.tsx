// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Tabs from '../../../lib/components/tabs';

test('renders on the server', () => {
  const html = renderToString(
    <Tabs
      ariaLabel="Project"
      activeTabId="nodes"
      tabs={[
        { id: 'overview', label: 'Overview', content: 'Overview content' },
        { id: 'nodes', label: 'Nodes', content: 'Nodes content' },
      ]}
    />
  );
  expect(html).toContain('role="tablist"');
  expect(html).toContain('aria-selected="true"');
  expect(html).toContain('Nodes content');
  expect(html).not.toContain('Overview content');
});
