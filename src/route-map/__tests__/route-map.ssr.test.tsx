// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import RouteMap from '../../../lib/components/route-map';

test('renders on the server', () => {
  const html = renderToString(
    <RouteMap
      ariaLabel="Route"
      currentStopId="a"
      lines={[{ id: 'one', title: 'Line one', href: '/one/', stops: [{ id: 'a', status: 'open' }] }]}
      terminus={{ title: 'End' }}
    />
  );
  expect(html).toContain('Line one');
  expect(html).toContain('You are here');
});
