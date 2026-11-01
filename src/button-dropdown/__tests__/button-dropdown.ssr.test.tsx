// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import ButtonDropdown from '../../../lib/components/button-dropdown';

test('renders on the server, closed', () => {
  const html = renderToString(
    <ButtonDropdown items={[{ id: 'start', text: 'Start' }]} mainAction={{ text: 'Launch' }} expandToViewport={true}>
      Actions
    </ButtonDropdown>
  );
  expect(html).toContain('Launch');
  expect(html).toContain('aria-haspopup="menu"');
  expect(html).toContain('aria-expanded="false"');
  expect(html).not.toContain('role="menu"');
});
