// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import AreaChart from '../../../../lib/charts/area-chart';

test('renders on the server', () => {
  const html = renderToString(
    <AreaChart
      series={[
        {
          title: 'North annex',
          type: 'area',
          data: [
            { x: 1, y: 4 },
            { x: 2, y: 6 },
          ],
        },
        {
          title: 'South annex',
          type: 'area',
          data: [
            { x: 1, y: 2 },
            { x: 2, y: 3 },
          ],
        },
      ]}
      ariaLabel="Requests"
    />
  );
  expect(html).toContain('aria-label="Requests"');
  expect(html).toContain('<pattern');
  expect(html).toContain('South annex');
});
