// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import HowItWorks from '../../../lib/components/how-it-works';

test('renders on the server', () => {
  const html = renderToString(
    <HowItWorks
      orientation="vertical"
      steps={[{ title: 'Book a slot', description: 'Pick a time online.' }, { title: 'Ride home' }]}
    />
  );
  expect(html).toContain('<ol');
  expect(html).toContain('role="list"');
  expect(html).toContain('<h3');
  expect(html).toContain('Book a slot');
  expect(html).toContain('Pick a time online.');
});
