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

test('renders the search and inline label variants on the server', () => {
  const search = renderToString(<Input type="search" ariaLabel="Find" value="north" clearAriaLabel="Clear search" />);
  expect(search).toContain('type="search"');
  expect(search).toContain('aria-label="Clear search"');
  const inline = renderToString(<Input inlineLabelText="Region" value="" />);
  expect(inline).toContain('Region');
  expect(inline).toContain('<label');
});
