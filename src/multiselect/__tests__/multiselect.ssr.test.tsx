// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import FormField from '../../../lib/components/form-field';
import Multiselect from '../../../lib/components/multiselect';

test('renders on the server, closed, with tokens', () => {
  const html = renderToString(
    <FormField label="Regions">
      <Multiselect
        options={[
          { value: 'us-east', label: 'US East' },
          { value: 'us-west', label: 'US West' },
        ]}
        selectedOptions={[{ value: 'us-west' }]}
        filteringType="auto"
        enableSelectAll={true}
      />
    </FormField>
  );
  expect(html).toContain('Regions');
  expect(html).toContain('1 option selected');
  expect(html).toContain('US West');
  expect(html).toContain('aria-label="Remove US West"');
  expect(html).not.toContain('role="listbox"');
});
