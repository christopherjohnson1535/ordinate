// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import OpeningHours from '../../../lib/components/opening-hours';

test('renders on the server, leaving today to the browser', () => {
  const html = renderToString(
    <OpeningHours
      caption="Opening hours"
      locale="en-GB"
      highlightToday={true}
      days={[
        { day: 'monday', opens: '08:00', closes: '18:00' },
        { day: 'sunday', closed: true },
      ]}
    />
  );
  expect(html).toContain('<caption');
  expect(html).toContain('scope="row"');
  expect(html).toContain('Monday');
  expect(html).toMatch(/datetime="08:00"/i);
  expect(html).toContain('Closed');
  expect(html).not.toContain('Today');
});
