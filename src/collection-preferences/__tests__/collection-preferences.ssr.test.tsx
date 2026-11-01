// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import CollectionPreferences from '../../../lib/components/collection-preferences';

test('renders the settings button on the server, with the modal closed', () => {
  const html = renderToString(
    <CollectionPreferences
      preferences={{ pageSize: 10, contentDisplay: [{ id: 'name', visible: true }] }}
      pageSizePreference={{ options: [{ value: 10 }, { value: 20 }] }}
      wrapLinesPreference={{}}
      stickyColumnsPreference={{ firstColumns: { options: [{ value: 0, label: 'None' }] } }}
      contentDisplayPreference={{ options: [{ id: 'name', label: 'Name' }] }}
      customPreference={() => 'Custom'}
    />
  );
  expect(html).toContain('aria-label="Preferences"');
  expect(html).toContain('Confirm');
  expect(html).not.toContain(' open=');
});

test('renders a disabled settings button on the server', () => {
  const html = renderToString(<CollectionPreferences disabled={true} title="Table settings" />);
  expect(html).toContain('aria-label="Table settings"');
  expect(html).toContain('disabled');
});
