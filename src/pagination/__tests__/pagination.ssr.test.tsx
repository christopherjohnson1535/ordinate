// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Pagination from '../../../lib/components/pagination';

test('renders on the server', () => {
  const html = renderToString(<Pagination currentPageIndex={4} pagesCount={12} />);
  expect(html).toContain('aria-label="Pagination"');
  expect(html).toContain('aria-label="Page 4 of 12"');
  expect(html).toContain('aria-current="true"');
  expect(html).toContain('aria-label="Next page"');
});
