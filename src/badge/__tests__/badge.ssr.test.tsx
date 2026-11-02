// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Badge from '../../../lib/components/badge';

test('renders on the server', () => {
  expect(renderToString(<Badge tone="note">Beta</Badge>)).toContain('Beta');
});
