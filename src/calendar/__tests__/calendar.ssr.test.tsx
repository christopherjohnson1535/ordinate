// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Calendar from '../../../lib/components/calendar';

test('renders on the server', () => {
  const html = renderToString(<Calendar ariaLabel="Delivery date" locale="en-US" value="2026-03-05" />);
  expect(html).toContain('March 2026');
  expect(html).toContain('role="grid"');
  expect(html).toContain('aria-label="Thursday, March 5, 2026"');
});
