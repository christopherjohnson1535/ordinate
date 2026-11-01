// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Autosuggest from '../../../lib/components/autosuggest';
import FormField from '../../../lib/components/form-field';

test('renders on the server, closed', () => {
  const html = renderToString(
    <FormField label="Host">
      <Autosuggest value="east" options={[{ value: 'east-1' }, { value: 'west-1' }]} placeholder="Find a host" />
    </FormField>
  );
  expect(html).toContain('Host');
  expect(html).toContain('role="combobox"');
  expect(html).toContain('value="east"');
  expect(html).toContain('aria-expanded="false"');
  expect(html).not.toContain('role="listbox"');
});
