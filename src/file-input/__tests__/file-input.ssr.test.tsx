// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import FileInput from '../../../lib/components/file-input';

test('renders on the server', () => {
  const html = renderToString(<FileInput value={[]} multiple={true} accept=".pdf" />);
  expect(html).toContain('type="file"');
  expect(html).toContain('accept=".pdf"');
  expect(html).toContain('Choose files');
});
