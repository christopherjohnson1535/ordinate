// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import StoryCard from '../../../lib/components/story-card';

test('renders on the server', () => {
  const html = renderToString(<StoryCard title="On walking slowly" href="/walking" number="04" />);
  expect(html).toContain('<h3');
  expect(html).toContain('href="/walking"');
});
