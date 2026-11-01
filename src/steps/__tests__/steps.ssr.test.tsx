// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Steps from '../../../lib/components/steps';

test('renders on the server', () => {
  const html = renderToString(
    <Steps
      ariaLabel="Deployment"
      steps={[
        { header: 'Build image', status: 'success', details: '2 minutes' },
        { header: 'Deploy', status: 'pending' },
      ]}
    />
  );
  expect(html).toContain('<ol');
  expect(html).toContain('aria-label="Deployment"');
  expect(html).toContain('Build image');
  expect(html).toContain('2 minutes');
});
