// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Token from '../../../lib/components/token';

test('renders on the server', () => {
  const html = renderToString(
    <div>
      <Token label="US East" description="Virginia" onDismiss={() => {}} />
      <Token variant="inline" label="report.pdf" />
    </div>
  );
  expect(html).toContain('US East');
  expect(html).toContain('Virginia');
  expect(html).toContain('aria-label="Remove"');
  expect(html).toContain('report.pdf');
});
