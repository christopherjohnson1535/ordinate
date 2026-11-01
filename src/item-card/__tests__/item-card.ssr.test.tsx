// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import ItemCard from '../../../lib/components/item-card';

test('renders on the server', () => {
  const html = renderToString(
    <ItemCard header="node-01" description="Compute node" footer="Updated now" selected={true}>
      Running.
    </ItemCard>
  );
  expect(html).toContain('node-01');
  expect(html).toContain('Compute node');
  expect(html).toContain('Updated now');
  expect(html).toContain('Running.');
});
