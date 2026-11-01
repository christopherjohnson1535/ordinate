// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Cards from '../../../lib/components/cards';

test('renders on the server', () => {
  const html = renderToString(
    <Cards
      items={[{ name: 'node-01', zone: 'us-east-1a' }]}
      cardDefinition={{
        header: item => item.name,
        sections: [{ id: 'zone', header: 'Zone', content: item => item.zone }],
      }}
      selectionType="multi"
      selectedItems={[]}
    />
  );
  expect(html).toContain('<ul');
  expect(html).toContain('node-01');
  expect(html).toContain('us-east-1a');
  expect(html).toContain('type="checkbox"');
});
