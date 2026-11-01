// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import TokenGroup from '../../../lib/components/token-group';

test('renders on the server', () => {
  const html = renderToString(
    <TokenGroup items={[{ label: 'US East' }, { label: 'US West' }]} limit={1} onDismiss={() => {}} />
  );
  expect(html).toContain('US East');
  expect(html).not.toContain('US West');
  expect(html).toContain('Show 1 more');
  expect(html).toContain('aria-label="Remove US East"');
});
