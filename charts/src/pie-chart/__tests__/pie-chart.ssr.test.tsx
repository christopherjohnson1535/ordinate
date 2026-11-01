// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import PieChart from '../../../../lib/charts/pie-chart';

test('renders on the server', () => {
  const html = renderToString(
    <PieChart
      data={[
        { title: 'Drawings', value: 50 },
        { title: 'Models', value: 20 },
      ]}
      variant="donut"
      innerMetricValue="70 GB"
      ariaLabel="Storage"
    />
  );
  expect(html).toContain('aria-label="Storage"');
  expect(html).toContain('70 GB');
  expect(html).toContain('Drawings');
});
