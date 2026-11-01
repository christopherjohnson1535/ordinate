// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Tooltip from '../../../lib/components/tooltip';

test('renders the trigger and a hidden tooltip on the server', () => {
  const html = renderToString(
    <Tooltip content="Copy the node ID" position="bottom">
      <button type="button">Copy</button>
    </Tooltip>
  );
  expect(html).toContain('Copy</button>');
  expect(html).toContain('role="tooltip"');
  expect(html).toContain('hidden=""');
});
