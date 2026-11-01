// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import BarChart from '../../../../lib/charts/bar-chart';

test('renders on the server', () => {
  const html = renderToString(
    <BarChart
      series={[
        {
          title: 'Drafting',
          type: 'bar',
          data: [
            { x: 'Q1', y: 4 },
            { x: 'Q2', y: 6 },
          ],
        },
      ]}
      horizontalBars={true}
      ariaLabel="Spend"
    />
  );
  expect(html).toContain('aria-label="Spend"');
  expect(html).toContain('<rect');
  expect(html).toContain('Q2');
});
