// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Flashbar from '../../../lib/components/flashbar';

test('renders on the server', () => {
  const html = renderToString(
    <Flashbar
      stackItems={true}
      items={[
        { type: 'fault', header: 'Deployment failed', dismissible: true },
        { type: 'complete', header: 'Backup complete' },
      ]}
    />
  );
  expect(html).toContain('Deployment failed');
  expect(html).toContain('aria-label="Dismiss"');
  expect(html).toContain('1 fault');
  expect(html).toContain('Show all 2');
});
