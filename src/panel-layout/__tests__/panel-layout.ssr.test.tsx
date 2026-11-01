// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import PanelLayout from '../../../lib/components/panel-layout';

test('renders on the server', () => {
  const html = renderToString(
    <PanelLayout resizable={true} panelSize={280} panelContent="Filters" mainContent="Results" />
  );
  expect(html).toContain('Filters');
  expect(html).toContain('Results');
  expect(html).toContain('role="separator"');
  expect(html).toContain('--panel-size:280px');
});
