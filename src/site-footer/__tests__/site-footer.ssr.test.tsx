// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import SiteFooter from '../../../lib/components/site-footer';

test('renders on the server', () => {
  const html = renderToString(
    <SiteFooter
      brand={{ name: 'Rosie’s Bakes', href: '/' }}
      columns={[{ title: 'Visit', links: [{ text: 'Find us', href: '/map' }] }]}
      legal="© 2026 Rosie’s Bakes"
      tone="inverted"
    >
      12 Shore Road
    </SiteFooter>
  );
  expect(html).toMatch(/^<footer /);
  expect(html).toMatch(/<nav [^>]*aria-label="Footer"/);
  expect(html).toMatch(/<h2 [^>]*>Visit<\/h2>/);
  expect(html).toContain('12 Shore Road');
});
