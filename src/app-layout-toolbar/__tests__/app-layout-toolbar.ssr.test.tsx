// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import AppLayoutToolbar from '../../../lib/components/app-layout-toolbar';

test('renders on the server', () => {
  const html = renderToString(
    <AppLayoutToolbar
      breadcrumbs="Home"
      drawers={[{ id: 'activity', ariaLabel: 'Activity', iconName: 'history', badge: true }]}
      activeDrawerId="activity"
    />
  );
  expect(html).toContain('aria-label="Open navigation"');
  expect(html).toContain('aria-label="Activity"');
  expect(html).toContain('aria-expanded="true"');
  expect(html).toContain('Home');
});
