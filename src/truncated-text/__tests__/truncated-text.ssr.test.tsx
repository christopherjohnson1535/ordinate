// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import TruncatedText from '../../../lib/components/truncated-text';

test('renders on the server', () => {
  const html = renderToString(<TruncatedText lines={2}>A long description of the node</TruncatedText>);
  expect(html).toContain('A long description of the node');
  expect(html).toContain('-webkit-line-clamp:2');
  expect(html).not.toContain('tabindex');
});
