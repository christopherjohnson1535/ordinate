// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import CopyToClipboard from '../../../lib/components/copy-to-clipboard';

test('renders every variant on the server', () => {
  const html = renderToString(
    <>
      <CopyToClipboard textToCopy="node-7f3a" />
      <CopyToClipboard textToCopy="node-7f3a" variant="icon" copyButtonAriaLabel="Copy node ID" />
      <CopyToClipboard textToCopy="node-7f3a" variant="inline" textToDisplay="node-7f…" />
      <CopyToClipboard textToCopy="node-7f3a" disabled={true} disabledReason="No access" />
    </>
  );
  expect(html).toContain('>Copy</span>');
  expect(html).toContain('aria-label="Copy node ID"');
  expect(html).toContain('node-7f…');
  expect(html).toContain('role="tooltip"');
  expect(html).not.toContain('role="status"');
});
