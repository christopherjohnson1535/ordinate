// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import FormField from '../../../lib/components/form-field';
import Input from '../../../lib/components/input';

test('renders on the server', () => {
  const html = renderToString(
    <FormField label="Project name" errorText="Enter a name.">
      <Input value="north-annex" />
    </FormField>
  );
  expect(html).toContain('Project name');
  expect(html).toContain('value="north-annex"');
});
