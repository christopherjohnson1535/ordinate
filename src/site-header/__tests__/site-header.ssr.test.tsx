// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import SiteHeader from '../../../lib/components/site-header';

test('renders on the server', () => {
  const html = renderToString(
    <SiteHeader
      brand={{ name: 'Fixit Bikes', href: '/' }}
      links={[
        { text: 'Repairs', href: '/repairs', current: true },
        { text: 'Visit', href: '/visit' },
      ]}
      notice="Open today 8–6"
      sticky={true}
    />
  );
  expect(html).toMatch(/^<header /);
  expect(html).toMatch(/<nav [^>]*aria-label="Main"/);
  expect(html).toMatch(/<button [^>]*aria-expanded="false"/);
  expect(html).toContain('aria-current="page"');
  expect(html).toContain('Open today 8–6');
});
