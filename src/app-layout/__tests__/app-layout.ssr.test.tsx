// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import AppLayout from '../../../lib/components/app-layout';

test('renders the wide layout on the server', () => {
  const html = renderToString(
    <AppLayout
      navigation="Navigation"
      breadcrumbs="Home"
      notifications="Notice"
      tools="Help"
      toolsOpen={true}
      drawers={[
        {
          id: 'activity',
          trigger: { iconName: 'history' },
          ariaLabels: { drawerName: 'Activity' },
          badge: true,
          content: 'Events',
        },
      ]}
      content="Page content"
    />
  );
  expect(html).toContain('aria-label="Navigation drawer"');
  expect(html).toContain('<main');
  expect(html).toContain('aria-label="Help panel"');
  expect(html).toContain('aria-label="Activity"');
  expect(html).toContain('Page content');
  expect(html).toContain('max-inline-size:1280px');
});

test('renders the toolbar variant on the server', () => {
  const html = renderToString(<AppLayout variant="toolbar" navigation="Navigation" breadcrumbs="Home" />);
  expect(html).toContain('aria-label="Close navigation"');
  expect(html).toContain('Home');
});
