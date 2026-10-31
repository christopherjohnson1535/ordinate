// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Box from '../../../lib/components/box';

test('renders on the server', () => {
  const html = renderToString(
    <Box variant="h2" tagOverride="div" padding={{ vertical: 's' }}>
      Usage
    </Box>
  );
  expect(html).toMatch(/^<div [^>]*>Usage<\/div>$/);
});
