// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Header from '../../../lib/components/header';

test('renders on the server', () => {
  const html = renderToString(
    <Header variant="h1" description="Machines in this project.">
      Nodes
    </Header>
  );
  expect(html).toMatch(/<h1 [^>]*>.*Nodes.*<\/h1>/);
  expect(html).toContain('Machines in this project.');
});
