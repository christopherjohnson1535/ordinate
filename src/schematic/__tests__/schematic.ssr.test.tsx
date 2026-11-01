// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Schematic from '../../../lib/components/schematic';

test('renders every variant on the server', () => {
  for (const variant of ['schematic', 'sketch', 'chalkboard'] as const) {
    const html = renderToString(
      <Schematic
        width={200}
        height={100}
        variant={variant}
        ariaLabel="A service"
        parts={[{ id: 'svc', x: 10, y: 10, width: 120, height: 40, label: 'Service web' }]}
        wires={[
          {
            id: 'in',
            points: [
              [0, 30],
              [10, 30],
            ],
            flow: true,
          },
        ]}
      />
    );
    expect(html).toContain('<svg');
    expect(html).toContain('Service web');
  }
});
