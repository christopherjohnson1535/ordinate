// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import DateInput from '../../../lib/components/date-input';
import FormField from '../../../lib/components/form-field';

test('renders on the server', () => {
  const html = renderToString(
    <FormField label="Start date">
      <DateInput value="2026-03-05" placeholder="YYYY/MM/DD" />
    </FormField>
  );
  expect(html).toContain('Start date');
  expect(html).toContain('value="2026/03/05"');
  expect(html).toContain('inputMode="numeric"');
});
