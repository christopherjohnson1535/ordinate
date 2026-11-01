// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import DatePicker from '../../../lib/components/date-picker';
import FormField from '../../../lib/components/form-field';

test('renders on the server, closed', () => {
  const html = renderToString(
    <FormField label="Delivery date">
      <DatePicker value="2026-03-05" locale="en-US" />
    </FormField>
  );
  expect(html).toContain('Delivery date');
  expect(html).toContain('value="2026/03/05"');
  expect(html).toContain('aria-expanded="false"');
  expect(html).not.toContain('role="grid"');
});
