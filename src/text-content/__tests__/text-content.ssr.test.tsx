// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import TextContent from '../../../lib/components/text-content';

test('renders on the server', () => {
  const html = renderToString(
    <TextContent>
      <h2>Overview</h2>
      <p>Plain text.</p>
    </TextContent>
  );
  expect(html).toContain('<h2>Overview</h2>');
  expect(html).toContain('<p>Plain text.</p>');
});
