// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Terminal from '../../../lib/components/terminal';

test('renders on the server', () => {
  const html = renderToString(<Terminal lines={[{ text: '$ make', type: 'command' }, { text: 'ok' }]} />);
  expect(html).toContain('<pre');
  expect(html).toContain('$ make');
});
