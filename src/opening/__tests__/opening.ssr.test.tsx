// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Opening from '../../../lib/components/opening';

test.each(['statement', 'split', 'masthead'] as const)('renders the %s variant on the server', variant => {
  const html = renderToString(
    <Opening
      variant={variant}
      title="The Allotment"
      meta="No. 14"
      links={[{ text: 'Essays', href: '#essays' }]}
      media={<img src="/plot.jpg" alt="Plot 7" />}
      mediaCaption="Plot 7"
    />
  );
  expect(html).toMatch(/<h1 [^>]*>The Allotment<\/h1>/);
  expect(html).toContain('No. 14');
  expect(html).toMatch(/<nav [^>]*aria-label="Sections"/);
  expect(html).toContain('alt="Plot 7"');
});
