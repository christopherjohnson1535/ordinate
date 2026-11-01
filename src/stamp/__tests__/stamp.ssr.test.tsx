// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Stamp from '../../../lib/components/stamp';

test('renders on the server', () => {
  const html = renderToString(<Stamp type="draft">Draft</Stamp>);
  expect(html).toContain('Draft');
  expect(html).toContain('type-draft');
});
