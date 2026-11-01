// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import LineChart from '../../../../lib/charts/line-chart';

test('renders on the server', () => {
  const html = renderToString(
    <LineChart
      series={[
        {
          title: 'North annex',
          type: 'line',
          data: [
            { x: 1, y: 4 },
            { x: 2, y: 6 },
          ],
        },
        { title: 'Capacity', type: 'threshold', y: 8 },
      ]}
      ariaLabel="Requests"
      xTitle="Hour"
    />
  );
  expect(html).toContain('aria-label="Requests"');
  expect(html).toContain('North annex');
  expect(html).toContain('<path');
  expect(html).toContain('Hour');
});
