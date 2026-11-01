// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Measure from '../../../lib/components/measure';

test('renders on the server', () => {
  const html = renderToString(
    <Measure label="Nodes in service" value={20} max={32} unit="nodes" limit={30} limitLabel="quota" />
  );
  expect(html).toContain('Nodes in service');
  expect(html).toContain('of 32');
  expect(html).toContain('quota');
  expect(html).toContain('aria-hidden="true"');
});
