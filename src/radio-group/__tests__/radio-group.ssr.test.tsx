// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import RadioGroup from '../../../lib/components/radio-group';

test('renders on the server', () => {
  const html = renderToString(
    <RadioGroup
      ariaLabel="Plan"
      value="team"
      items={[
        { value: 'free', label: 'Free' },
        { value: 'team', label: 'Team' },
      ]}
    />
  );
  expect(html).toContain('role="radiogroup"');
  expect(html).toContain('Team');
  expect(html).toMatch(/<input[^>]*checked=""[^>]*value="team"/);
});
