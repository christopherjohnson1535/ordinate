// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import ExpandableSection from '../../../lib/components/expandable-section';

test('renders on the server', () => {
  const html = renderToString(
    <ExpandableSection variant="container" headerText="Instances" defaultExpanded={true}>
      Table
    </ExpandableSection>
  );
  expect(html).toContain('Instances');
  expect(html).toContain('aria-expanded="true"');
  expect(html).toContain('Table');
});
