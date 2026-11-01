// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Plate from '../../../lib/components/plate';

test('renders on the server', () => {
  const html = renderToString(<Plate label="Plate I" title="Harbour House" href="/work/harbour" />);
  expect(html).toContain('Plate I');
  expect(html).toContain('href="/work/harbour"');
});
