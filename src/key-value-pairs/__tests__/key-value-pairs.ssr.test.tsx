// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import KeyValuePairs from '../../../lib/components/key-value-pairs';

test('renders on the server', () => {
  const html = renderToString(
    <KeyValuePairs
      columns={2}
      items={[
        { label: 'Region', value: 'north-annex' },
        { type: 'group', title: 'Network', items: [{ label: 'Subnet', value: 'subnet-7' }] },
      ]}
    />
  );
  expect(html).toContain('<dt');
  expect(html).toContain('north-annex');
  expect(html).toContain('subnet-7');
});
