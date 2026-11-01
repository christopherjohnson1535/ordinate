// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Article from '../../../lib/components/article';

test('renders on the server', () => {
  const html = renderToString(
    <Article lead="Six bakers explain." byline="By Tom Lindqvist" dropCap={true} columns={2} measure="narrow">
      <p>Every miller on the river once knew the sound.</p>
      <h2>Why grind slowly</h2>
    </Article>
  );
  expect(html).toContain('Six bakers explain.');
  expect(html).toContain('By Tom Lindqvist');
  expect(html).toContain('<p>Every miller');
  expect(html).toContain('<h2>Why grind slowly</h2>');
});
