// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Checkbox from '../../../lib/components/checkbox';

test('renders on the server', () => {
  const html = renderToString(
    <Checkbox checked={true} indeterminate={true} description="Keeps logs for 30 days.">
      Enable logging
    </Checkbox>
  );
  expect(html).toContain('Enable logging');
  expect(html).toContain('Keeps logs for 30 days.');
  expect(html).toContain('type="checkbox"');
});
