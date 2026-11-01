// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import PropertyFilter from '../../../lib/components/property-filter';

test('renders on the server with its filters, closed', () => {
  const html = renderToString(
    <PropertyFilter
      query={{
        tokens: [
          { propertyKey: 'status', operator: '=', value: 'running' },
          { operator: ':', value: 'web' },
        ],
        operation: 'or',
      }}
      filteringProperties={[{ key: 'status', propertyLabel: 'Status' }]}
      filteringOptions={[{ propertyKey: 'status', value: 'running', label: 'Running' }]}
      countText="3 matches"
    />
  );
  expect(html).toContain('role="combobox"');
  expect(html).toContain('aria-expanded="false"');
  expect(html).not.toContain('role="listbox"');
  expect(html).toContain('Running');
  expect(html).toContain('web');
  expect(html).toContain('or');
  expect(html).toContain('Clear filters');
  expect(html).toContain('3 matches');
});
