// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import FileDropzone from '../../../lib/components/file-dropzone';

test('renders on the server', () => {
  const html = renderToString(<FileDropzone>Drop files to upload</FileDropzone>);
  expect(html).toContain('Drop files to upload');
});
