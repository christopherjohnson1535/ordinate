// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import FormField from '../../../lib/components/form-field';
import Slider from '../../../lib/components/slider';

test('renders on the server', () => {
  const html = renderToString(
    <FormField label="Opacity">
      <Slider value={40} min={0} max={100} tickMarks={true} step={25} valueFormatter={value => `${value}%`} />
    </FormField>
  );
  expect(html).toContain('type="range"');
  expect(html).toContain('value="40"');
  expect(html).toContain('aria-valuetext="40%"');
  expect(html).toContain('100%');
  expect(html).toContain('--slider-value:0.4');
});
