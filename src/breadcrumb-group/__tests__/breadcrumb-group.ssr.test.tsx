// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import BreadcrumbGroup from '../../../lib/components/breadcrumb-group';

test('renders on the server', () => {
  const html = renderToString(
    <BreadcrumbGroup
      items={[
        { text: 'Projects', href: '/projects' },
        { text: 'north-annex', href: '/projects/north-annex' },
      ]}
    />
  );
  expect(html).toContain('aria-label="Breadcrumbs"');
  expect(html).toContain('href="/projects"');
  expect(html).toContain('aria-current="page"');
});
