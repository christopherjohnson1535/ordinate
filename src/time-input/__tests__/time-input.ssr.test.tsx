// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import FormField from '../../../lib/components/form-field';
import TimeInput from '../../../lib/components/time-input';

test('renders on the server', () => {
  const html = renderToString(
    <FormField label="Start time">
      <TimeInput value="09:30" format="hh:mm" />
    </FormField>
  );
  expect(html).toContain('Start time');
  expect(html).toContain('value="09:30"');
});
