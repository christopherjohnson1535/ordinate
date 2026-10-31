// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Toggle from '../../../lib/components/toggle';

test('renders on the server', () => {
  const html = renderToString(<Toggle checked={true}>Auto-scaling</Toggle>);
  expect(html).toContain('Auto-scaling');
  expect(html).toContain('role="switch"');
});
