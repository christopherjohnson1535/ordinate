// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import StatusIndicator from '../../../lib/components/status-indicator';

test('renders on the server', () => {
  expect(renderToString(<StatusIndicator type="success">Running</StatusIndicator>)).toContain('Running');
  expect(renderToString(<StatusIndicator type="loading">Loading</StatusIndicator>)).toContain('<svg');
});
