// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Skeleton from '../../../lib/components/skeleton';

test('renders on the server', () => {
  const html = renderToString(<Skeleton lines={2} />);
  expect(html).toContain('aria-busy="true"');
  expect(html).toContain('Loading');
});
