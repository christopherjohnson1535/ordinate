// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Header from '../../../lib/components/header';
import Table from '../../../lib/components/table';

test('renders on the server', () => {
  const html = renderToString(
    <Table
      header={<Header>Parts</Header>}
      items={[{ name: 'Base plate' }]}
      columnDefinitions={[{ id: 'name', header: 'Name', cell: item => item.name, sortingField: 'name' }]}
      selectionType="multi"
      resizableColumns={true}
      stickyHeader={true}
      footer="Updated hourly."
    />
  );
  expect(html).toContain('<table');
  expect(html).toContain('Parts');
  expect(html).toContain('Base plate');
  expect(html).toContain('aria-sort="none"');
  expect(html).toContain('Updated hourly.');
});
