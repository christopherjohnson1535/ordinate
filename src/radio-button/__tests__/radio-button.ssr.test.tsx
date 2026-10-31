// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import RadioButton from '../../../lib/components/radio-button';

test('renders on the server', () => {
  const html = renderToString(
    <RadioButton checked={true} name="plan" value="team">
      Team
    </RadioButton>
  );
  expect(html).toContain('Team');
  expect(html).toContain('type="radio"');
});
