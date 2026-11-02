// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Container from '../../../lib/components/container';

test('renders on the server', () => {
  const html = renderToString(
    <Container kind="resource" reference="R1" heading="Usage" measure="12 nodes" footer="Updated hourly.">
      12 nodes are running.
    </Container>
  );
  expect(html).toContain('Usage');
  expect(html).toContain('12 nodes');
  expect(html).toContain('12 nodes are running.');
  expect(html).toContain('Updated hourly.');
});
