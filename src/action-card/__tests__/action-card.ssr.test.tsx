// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import ActionCard from '../../../lib/components/action-card';

test('renders on the server', () => {
  const html = renderToString(
    <div>
      <ActionCard header="Create a cluster" description="Three nodes." />
      <ActionCard header="Read the guide" href="/guide" />
    </div>
  );
  expect(html).toContain('<button');
  expect(html).toContain('href="/guide"');
  expect(html).toContain('Three nodes.');
});
