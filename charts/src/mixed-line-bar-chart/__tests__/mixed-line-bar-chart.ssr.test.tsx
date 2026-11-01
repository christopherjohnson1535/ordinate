// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import MixedLineBarChart from '../../../../lib/charts/mixed-line-bar-chart';

test('renders on the server', () => {
  const html = renderToString(
    <MixedLineBarChart
      series={[
        { title: 'Issued', type: 'bar', data: [{ x: 'Jan', y: 4 }] },
        { title: 'Average', type: 'line', data: [{ x: 'Jan', y: 3 }] },
      ]}
      ariaLabel="Drawings"
    />
  );
  expect(html).toContain('aria-label="Drawings"');
  expect(html).toContain('Average');
});
