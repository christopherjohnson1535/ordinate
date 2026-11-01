// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import ColumnLayout from '../../../lib/components/column-layout';

test('renders on the server with every column', () => {
  const html = renderToString(
    <ColumnLayout columns={3} borders="vertical">
      <div>Compute</div>
      <div>Storage</div>
      <div>Network</div>
    </ColumnLayout>
  );
  expect(html).toContain('Storage');
  expect(html).toContain('--column-count:3');
});
