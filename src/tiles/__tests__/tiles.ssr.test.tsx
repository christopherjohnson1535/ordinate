// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import FormField from '../../../lib/components/form-field';
import Tiles from '../../../lib/components/tiles';

test('renders on the server', () => {
  const html = renderToString(
    <FormField label="Plan">
      <Tiles
        value="team"
        items={[
          { value: 'free', label: 'Free', description: 'One project.' },
          { value: 'team', label: 'Team' },
        ]}
      />
    </FormField>
  );
  expect(html).toContain('role="radiogroup"');
  expect(html).toContain('One project.');
  expect(html).toMatch(/checked="" value="team"/);
});
