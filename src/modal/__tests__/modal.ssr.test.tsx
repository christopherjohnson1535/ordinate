// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Modal from '../../../lib/components/modal';

test('renders on the server, closed until it mounts', () => {
  const html = renderToString(
    <Modal visible={true} header="Delete project">
      Content
    </Modal>
  );
  expect(html).toContain('Delete project');
  expect(html).not.toContain(' open=');
});

test('renders the layout options on the server', () => {
  const html = renderToString(
    <Modal visible={true} header="Delete project" position="top" disableContentPaddings={true} hideDismissButton={true}>
      Content
    </Modal>
  );
  expect(html).toContain('Delete project');
  expect(html).not.toContain('aria-label="Close"');
});
