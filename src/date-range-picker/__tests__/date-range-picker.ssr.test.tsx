// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import DateRangePicker from '../../../lib/components/date-range-picker';
import FormField from '../../../lib/components/form-field';

test('renders on the server, closed', () => {
  const html = renderToString(
    <FormField label="Time range">
      <DateRangePicker
        locale="en-US"
        value={{ type: 'relative', amount: 30, unit: 'minute' }}
        relativeOptions={[{ key: 'previous-30-minutes', amount: 30, unit: 'minute', type: 'relative' }]}
      />
    </FormField>
  );
  expect(html).toContain('Time range');
  expect(html).toContain('Last 30 minutes');
  expect(html).toContain('aria-expanded="false"');
  expect(html).not.toContain('role="dialog"');
});
