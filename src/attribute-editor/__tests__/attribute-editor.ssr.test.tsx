// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import AttributeEditor from '../../../lib/components/attribute-editor';
import Input from '../../../lib/components/input';

test('renders on the server in the stacked layout', () => {
  const html = renderToString(
    <AttributeEditor
      items={[{ key: 'team', value: 'platform' }]}
      definition={[
        { label: 'Key', control: item => <Input value={item.key} /> },
        { label: 'Value', control: item => <Input value={item.value} /> },
      ]}
    />
  );
  expect(html).toContain('value="team"');
  expect(html).toContain('value="platform"');
  expect(html).toContain('Key</label>');
  expect(html).toContain('Remove');
  expect(html).toContain('Add new item');
});
