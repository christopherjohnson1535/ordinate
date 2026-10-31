// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Divider from '../../../lib/components/divider';

test('renders on the server', () => {
  expect(renderToString(<Divider />)).toMatch(/^<hr [^>]*\/>$/);
  expect(renderToString(<Divider>Or</Divider>)).toContain('role="separator"');
});
