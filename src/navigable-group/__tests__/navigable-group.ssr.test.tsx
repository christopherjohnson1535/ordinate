// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import NavigableGroup from '../../../lib/components/navigable-group';

test('renders on the server', () => {
  const html = renderToString(
    <NavigableGroup navigationDirection="horizontal" role="toolbar" ariaLabel="Edit" getItemKey={element => element.id}>
      <button id="copy">Copy</button>
    </NavigableGroup>
  );
  expect(html).toContain('role="toolbar"');
  expect(html).toContain('aria-label="Edit"');
  expect(html).toContain('Copy');
});
