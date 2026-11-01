// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Section from '../../../lib/components/section';

test('renders on the server', () => {
  const html = renderToString(
    <Section id="hours" heading="Opening hours" description="Closed on Sundays." tone="inverted" rule="double">
      Monday to Saturday, 8 to 6.
    </Section>
  );
  expect(html).toMatch(/<section [^>]*id="hours"/);
  expect(html).toMatch(/<h2 [^>]*>Opening hours<\/h2>/);
  expect(html).toContain('Closed on Sundays.');
  expect(html).toContain('Monday to Saturday, 8 to 6.');
});
