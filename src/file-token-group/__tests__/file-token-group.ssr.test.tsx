// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import FileTokenGroup from '../../../lib/components/file-token-group';

test('renders on the server', () => {
  const plan = new File(['plan'], 'site-plan.pdf', { type: 'application/pdf' });
  const section = new File([new Uint8Array(2_480)], 'section-a.png', { type: 'image/png' });
  const html = renderToString(
    <FileTokenGroup
      items={[{ file: plan }, { file: section }]}
      limit={1}
      showFileSize={true}
      showFileThumbnail={true}
      onDismiss={() => {}}
    />
  );
  expect(html).toContain('site-plan.pdf');
  expect(html).not.toContain('section-a.png');
  expect(html).toContain('4 B');
  expect(html).toContain('Show 1 more');
  expect(html).toContain('aria-label="Remove file 1, site-plan.pdf"');
});
