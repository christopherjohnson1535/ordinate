// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Drawer from '../../../lib/components/drawer';

test('renders on the server', () => {
  const html = renderToString(
    <Drawer header="Activity" footer="Done">
      Content
    </Drawer>
  );
  expect(html).toContain('Activity');
  expect(html).toContain('Done');
});

test('renders the loading state on the server', () => {
  const html = renderToString(<Drawer header="Activity" loading={true} loadingText="Starting" />);
  expect(html).toContain('role="status"');
  expect(html).toContain('Starting');
});
