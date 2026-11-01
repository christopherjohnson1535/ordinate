// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import MenuTile from '../../../lib/components/menu-tile';

test('renders on the server', () => {
  const html = renderToString(
    <MenuTile title="Quick fixes" badge="New" items={[{ label: 'Flat tire repair', value: '$18' }]} />
  );
  expect(html).toContain('Flat tire repair');
  expect(html).toContain('$18');
});
