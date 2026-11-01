// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import TopNavigation from '../../../lib/components/top-navigation';

test('renders on the server with every utility in the bar', () => {
  const html = renderToString(
    <TopNavigation
      identity={{ href: '/', title: 'Learning Lab' }}
      utilities={[
        { type: 'button', text: 'Docs', iconName: 'file' },
        { type: 'menu-dropdown', text: 'Account', items: [{ id: 'sign-out', text: 'Sign out' }] },
      ]}
      search={<input aria-label="Search" />}
    />
  );
  expect(html).toContain('<header');
  expect(html).toContain('Learning Lab');
  expect(html).toContain('Docs');
  expect(html).toContain('aria-haspopup="menu"');
});
