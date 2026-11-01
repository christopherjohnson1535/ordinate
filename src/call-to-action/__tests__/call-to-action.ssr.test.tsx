// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import CallToAction from '../../../lib/components/call-to-action';

test('renders on the server', () => {
  const html = renderToString(
    <CallToAction
      heading="Book a repair"
      description="Most bikes are back the same day."
      actions={<a href="/book">Book a repair</a>}
    />
  );
  expect(html).toMatch(/<h2 [^>]*>Book a repair<\/h2>/);
  expect(html).toContain('Most bikes are back the same day.');
  expect(html).toContain('href="/book"');
});
