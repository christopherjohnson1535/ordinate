// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import PullQuote from '../../../lib/components/pull-quote';

test('renders on the server', () => {
  const html = renderToString(
    <PullQuote variant="hanging" attribution="Mara Lindqvist">
      We stopped fighting the water.
    </PullQuote>
  );
  expect(html).toContain('<blockquote');
  expect(html).toContain('Mara Lindqvist');
});
