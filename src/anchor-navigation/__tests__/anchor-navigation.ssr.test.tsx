// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import AnchorNavigation from '../../../lib/components/anchor-navigation';

test('renders on the server', () => {
  const html = renderToString(
    <AnchorNavigation
      ariaLabelledby="toc"
      activeHref="#method"
      anchors={[
        { text: 'Overview', href: '#overview', level: 1 },
        { text: 'Method', href: '#method', level: 2, info: 'New' },
      ]}
    />
  );
  expect(html).toContain('<nav');
  expect(html).toContain('aria-labelledby="toc"');
  expect(html).toContain('href="#overview"');
  expect(html).toContain('aria-current="true"');
  expect(html).toContain('New');
});
