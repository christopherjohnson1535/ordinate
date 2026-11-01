// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import TextFilter from '../../../lib/components/text-filter';

test('renders on the server with its text and count', () => {
  const html = renderToString(
    <TextFilter filteringText="web" countText="3 matches" filteringPlaceholder="Find instances" />
  );
  expect(html).toContain('type="search"');
  expect(html).toContain('value="web"');
  expect(html).toContain('placeholder="Find instances"');
  expect(html).toContain('3 matches');
});
