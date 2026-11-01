// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import HelpPanel from '../../../lib/components/help-panel';

test('renders on the server', () => {
  const html = renderToString(
    <HelpPanel header="Endpoints" footer="Learn more">
      <p>Content</p>
    </HelpPanel>
  );
  expect(html).toContain('<h2');
  expect(html).toContain('Endpoints');
  expect(html).toContain('Learn more');
});

test('renders the loading state on the server', () => {
  const html = renderToString(<HelpPanel header="Endpoints" loading={true} />);
  expect(html).toContain('role="status"');
  expect(html).toContain('Loading');
});
