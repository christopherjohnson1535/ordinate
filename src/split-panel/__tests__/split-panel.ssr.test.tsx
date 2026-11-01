// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import AppLayout from '../../../lib/components/app-layout';
import SplitPanel from '../../../lib/components/split-panel';

test('renders open on the server', () => {
  const html = renderToString(
    <AppLayout
      splitPanelOpen={true}
      splitPanel={
        <SplitPanel header="na-01" headerDescription="Node in zone a">
          Details
        </SplitPanel>
      }
    />
  );
  expect(html).toContain('na-01');
  expect(html).toContain('role="separator"');
  expect(html).toContain('aria-label="Close panel"');
});

test('renders collapsed at the side on the server', () => {
  const html = renderToString(
    <AppLayout
      splitPanelOpen={false}
      splitPanelPreferences={{ position: 'side' }}
      splitPanel={<SplitPanel header="na-01">Details</SplitPanel>}
    />
  );
  expect(html).toContain('aria-label="Open panel"');
  expect(html).not.toContain('role="separator"');
});
