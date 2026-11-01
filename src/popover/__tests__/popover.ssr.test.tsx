// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Popover from '../../../lib/components/popover';

test('renders the trigger on the server, closed', () => {
  const html = renderToString(
    <Popover header="Memory" content="512 MiB in use">
      Usage
    </Popover>
  );
  expect(html).toContain('Usage');
  expect(html).toContain('aria-expanded="false"');
  expect(html).not.toContain('512 MiB in use');
});

test('renders a custom trigger with a portal setting on the server', () => {
  const html = renderToString(
    <Popover triggerType="custom" renderWithPortal={true} content="Details">
      <button type="button">Info</button>
    </Popover>
  );
  expect(html).toContain('Info');
});
