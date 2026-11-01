// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Figure from '../../../lib/components/figure';
import Media from '../../../lib/components/media';

test('renders on the server', () => {
  const html = renderToString(<Figure media={<Media />} label="Fig. 1" caption="The east quay." />);
  expect(html).toContain('<figcaption');
  expect(html).toContain('The east quay.');
});
