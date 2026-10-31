// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Link from '../../../lib/components/link';

test('renders on the server', () => {
  const html = renderToString(
    <Link href="https://example.com/docs" external={true} externalIconAriaLabel="Opens in a new tab">
      Read the docs
    </Link>
  );
  expect(html).toContain('href="https://example.com/docs"');
  expect(html).toContain('target="_blank"');
  expect(html).toContain('rel="noopener noreferrer"');
  expect(html).toContain('Opens in a new tab');
});
