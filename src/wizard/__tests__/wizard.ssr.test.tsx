// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Wizard, { WizardProps } from '../../../lib/components/wizard';

const steps: WizardProps.Step[] = [
  { title: 'Name the cluster', content: 'Name fields', errorText: 'Enter a name.' },
  { title: 'Add tags', isOptional: true, content: 'Tag fields' },
];

test('renders the checklist on the server', () => {
  const html = renderToString(
    <Wizard activeStepIndex={1} steps={steps} submitButtonText="Create cluster" aside="Title block" />
  );
  expect(html).toContain('aria-label="Checklist"');
  expect(html).toContain('aria-current="step"');
  expect(html).toContain('Tag fields');
  expect(html).not.toContain('Name fields');
  expect(html).toContain('Enter a name.');
  expect(html).toContain('Create cluster');
  expect(html).toContain('Title block');
});

test('renders the steps variant on the server', () => {
  const html = renderToString(
    <Wizard variant="steps" activeStepIndex={1} steps={steps} submitButtonText="Create cluster" />
  );
  expect(html).toContain('aria-label="Steps"');
  expect(html).toContain('aria-current="step"');
  expect(html).toContain('Tag fields');
  expect(html).toContain('Create cluster');
  expect(html).toContain('optional');
});
