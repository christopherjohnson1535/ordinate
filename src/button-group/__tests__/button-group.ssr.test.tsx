// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import ButtonGroup from '../../../lib/components/button-group';

test('renders the toolbar on the server', () => {
  const html = renderToString(
    <ButtonGroup
      ariaLabel="Response actions"
      items={[
        {
          type: 'group',
          text: 'Feedback',
          items: [{ type: 'icon-toggle-button', id: 'like', text: 'Helpful', iconName: 'thumbs-up', pressed: true }],
        },
        { type: 'icon-button', id: 'copy', text: 'Copy', iconName: 'copy', popoverFeedback: 'Copied' },
        { type: 'menu-dropdown', id: 'more', text: 'More actions', items: [{ id: 'report', text: 'Report' }] },
      ]}
    />
  );
  expect(html).toContain('role="toolbar"');
  expect(html).toContain('aria-label="Response actions"');
  expect(html).toContain('role="group"');
  expect(html).toContain('aria-label="Copy"');
  expect(html).toContain('aria-pressed="true"');
  expect(html).toContain('aria-label="More actions"');
  expect(html).not.toContain('role="status"');
});
