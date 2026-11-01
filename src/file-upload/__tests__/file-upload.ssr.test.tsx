// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import FileUpload from '../../../lib/components/file-upload';

test('renders on the server', () => {
  const plan = new File(['plan'], 'site-plan.pdf', { type: 'application/pdf' });
  const html = renderToString(
    <FileUpload
      value={[plan]}
      multiple={true}
      showFileSize={true}
      constraintText="PDF only"
      fileErrors={['Too large']}
    />
  );
  expect(html).toContain('type="file"');
  expect(html).toContain('Choose files');
  expect(html).toContain('site-plan.pdf');
  expect(html).toContain('PDF only');
  expect(html).toContain('Too large');
});
