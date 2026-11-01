// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Testimonial from '../../../lib/components/testimonial';

test('renders on the server', () => {
  const html = renderToString(<Testimonial quote="Honest advice." name="Jo" detail="Old Town" />);
  expect(html).toContain('<blockquote');
  expect(html).toContain('Old Town');
});
