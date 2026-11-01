// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import CodeView from '../../../lib/components/code-view';

test('renders on the server', () => {
  const html = renderToString(<CodeView content={'kind: Service\nspec: {}'} language="yaml" highlightedLines={[1]} />);
  expect(html).toContain('<pre');
  expect(html).toContain('kind: Service');
});
