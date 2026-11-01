// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import ToggleButton from '../../../lib/components/toggle-button';

test('renders on the server', () => {
  const html = renderToString(<ToggleButton pressed={true}>Bold</ToggleButton>);
  expect(html).toContain('aria-pressed="true"');
  expect(html).toContain('Bold');
});
