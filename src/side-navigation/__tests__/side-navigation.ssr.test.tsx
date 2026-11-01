// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import SideNavigation from '../../../lib/components/side-navigation';

test('renders on the server', () => {
  const html = renderToString(
    <SideNavigation
      header={{ text: 'Ordinate Cloud', href: '/' }}
      activeHref="/nodes"
      items={[
        { type: 'link', text: 'Dashboard', href: '/dashboard' },
        { type: 'section', text: 'Compute', items: [{ type: 'link', text: 'Nodes', href: '/nodes' }] },
      ]}
    />
  );
  expect(html).toContain('aria-label="Side navigation"');
  expect(html).toContain('Ordinate Cloud');
  expect(html).toContain('aria-current="page"');
  expect(html).toContain('aria-expanded="true"');
});
