// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import ContentLayout from '../../../lib/components/content-layout';
import Header from '../../../lib/components/header';

test('renders on the server', () => {
  const html = renderToString(
    <ContentLayout headerVariant="high-contrast" header={<Header variant="h1">Instances</Header>} maxContentWidth={960}>
      12 instances are running.
    </ContentLayout>
  );
  expect(html).toContain('Instances');
  expect(html).toContain('12 instances are running.');
  expect(html).toContain('--content-layout-max-width:960px');
});
