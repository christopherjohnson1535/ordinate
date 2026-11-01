// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Hotspot from '../../../lib/components/hotspot';

test('renders on the server', () => {
  const html = renderToString(
    <Hotspot hotspotId="name">
      <span>Name</span>
    </Hotspot>
  );
  expect(html).toContain('data-hotspot-id="name"');
  expect(html).toContain('Name');
});
