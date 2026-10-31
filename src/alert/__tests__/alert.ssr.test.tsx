// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Alert from '../../../lib/components/alert';

test('renders on the server', () => {
  const html = renderToString(
    <Alert type="warning" header="Certificate expires soon" dismissible={true}>
      It expires in 6 days.
    </Alert>
  );
  expect(html).toContain('Certificate expires soon');
  expect(html).toContain('aria-label="Dismiss"');
});
