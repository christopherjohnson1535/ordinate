// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Dialog from '../../../lib/components/dialog';

test('renders on the server', () => {
  const html = renderToString(
    <Dialog header="Rename node" footer={<button>Save</button>}>
      Content
    </Dialog>
  );
  expect(html).toContain('role="dialog"');
  expect(html).toContain('Rename node');
  expect(html).toContain('aria-label="Close dialog"');
  expect(html).toContain('Save');
});
