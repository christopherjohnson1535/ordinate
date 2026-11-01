// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import IndexList from '../../../lib/components/index-list';

test('renders on the server', () => {
  const html = renderToString(
    <IndexList
      variant="numbered"
      ordered={true}
      items={[{ id: 'harbour', label: 'Harbour House', value: '2025', href: '/harbour' }]}
    />
  );
  expect(html).toContain('<ol');
  expect(html).toContain('Harbour House');
});
