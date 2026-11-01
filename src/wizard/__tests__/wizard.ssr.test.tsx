// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Wizard from '../../../lib/components/wizard';

test('renders on the server', () => {
  const html = renderToString(
    <Wizard
      activeStepIndex={1}
      steps={[
        { title: 'Name the cluster', content: 'Name fields' },
        { title: 'Add tags', isOptional: true, content: 'Tag fields' },
      ]}
      submitButtonText="Create cluster"
    />
  );
  expect(html).toContain('aria-label="Steps"');
  expect(html).toContain('aria-current="step"');
  expect(html).toContain('Tag fields');
  expect(html).toContain('Create cluster');
  expect(html).toContain('optional');
});
