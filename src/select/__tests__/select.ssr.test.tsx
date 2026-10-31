// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import FormField from '../../../lib/components/form-field';
import Select from '../../../lib/components/select';

test('renders on the server, closed', () => {
  const html = renderToString(
    <FormField label="Region">
      <Select
        options={[
          { value: 'us-east', label: 'US East' },
          { value: 'us-west', label: 'US West' },
        ]}
        selectedOption={{ value: 'us-west', label: 'US West' }}
        filteringType="auto"
      />
    </FormField>
  );
  expect(html).toContain('Region');
  expect(html).toContain('US West');
  expect(html).toContain('aria-expanded="false"');
  expect(html).not.toContain('role="listbox"');
});
