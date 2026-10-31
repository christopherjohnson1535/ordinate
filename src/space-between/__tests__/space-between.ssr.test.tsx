// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import SpaceBetween from '../../../lib/components/space-between';

test('renders on the server', () => {
  const html = renderToString(
    <SpaceBetween size="m">
      <>
        <span>One</span>
        <span>Two</span>
      </>
    </SpaceBetween>
  );
  expect(html.match(/<div class="[^"]*_child_/g)).toHaveLength(2);
});
