// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import ErrorBoundary from '../../../lib/components/error-boundary';

test('renders its children on the server', () => {
  const html = renderToString(
    <ErrorBoundary>
      <p>Usage chart</p>
    </ErrorBoundary>
  );
  expect(html).toBe('<p>Usage chart</p>');
});
