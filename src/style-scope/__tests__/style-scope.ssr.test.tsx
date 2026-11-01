// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import StyleScope from '../../../lib/components/style-scope';

test('renders its classes on the server', () => {
  const html = renderToString(
    <StyleScope styleName="editorial" mode="light">
      Margins
    </StyleScope>
  );
  expect(html).toContain('ord-style-editorial');
  expect(html).toContain('ord-light-mode');
});
