// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import LiveRegion from '../../../lib/components/live-region';

test('renders on the server with an empty announcer', () => {
  const html = renderToString(<LiveRegion>3 results</LiveRegion>);
  expect(html).toContain('3 results');
  expect(html).toMatch(/aria-live="polite"[^>]*><\/span>/);
});
