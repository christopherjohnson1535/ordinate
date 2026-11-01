// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import SegmentedControl from '../../../lib/components/segmented-control';

test('renders on the server', () => {
  const html = renderToString(
    <SegmentedControl
      label="Period"
      options={[
        { id: 'day', text: 'Day' },
        { id: 'week', text: 'Week' },
      ]}
      selectedId="week"
    />
  );
  expect(html).toContain('role="group"');
  expect(html).toContain('aria-pressed="true"');
  expect(html).toContain('Week');
});
