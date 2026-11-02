// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import ProgressBar from '../../../lib/components/progress-bar';

test('renders on the server', () => {
  const html = renderToString(
    <>
      <ProgressBar value={42} label="Uploading backup" />
      <ProgressBar status="complete" resultText="Upload complete" />
    </>
  );
  expect(html).toContain('role="progressbar"');
  expect(html).toContain('aria-valuenow="42"');
  expect(html).toContain('Upload complete');
});
