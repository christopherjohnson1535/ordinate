// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import List from '../../../lib/components/list';

test('renders on the server', () => {
  const html = renderToString(
    <List
      ariaLabel="Pipeline"
      items={['Build', 'Deploy']}
      renderItem={item => ({ id: item, content: item })}
      sortable={true}
    />
  );
  expect(html).toContain('<ol');
  expect(html).toContain('Build');
  expect(html).toContain('aria-label="Move up"');
});
