// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Grid from '../../../lib/components/grid';

test('renders on the server with the placement of every breakpoint', () => {
  const html = renderToString(
    <Grid gridDefinition={[{ colspan: { default: 12, xs: 8 } }, { colspan: { default: 12, xs: 4 } }]}>
      <div>Main</div>
      <div>Aside</div>
    </Grid>
  );
  expect(html).toContain('Aside');
  expect(html).toContain('--grid-column-xs:9 / span 4');
});
