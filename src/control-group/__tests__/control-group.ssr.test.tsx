// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Button from '../../../lib/components/button';
import ControlGroup from '../../../lib/components/control-group';
import Input from '../../../lib/components/input';

test('renders on the server', () => {
  const html = renderToString(
    <ControlGroup ariaLabel="Search">
      <Input value="logs" ariaLabel="Query" />
      <Button>Search</Button>
    </ControlGroup>
  );
  expect(html).toContain('role="group"');
  expect(html).toContain('aria-label="Search"');
  expect(html).toContain('value="logs"');
  expect(html).toContain('Search</span></button>');
});
