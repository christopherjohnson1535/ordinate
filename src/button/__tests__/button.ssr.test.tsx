// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Button from '../../../lib/components/button';

test('renders on the server', () => {
  expect(renderToString(<Button variant="primary">Save changes</Button>)).toContain('Save changes');
  expect(renderToString(<Button href="/logs">View log</Button>)).toContain('href="/logs"');
});

test('renders icons, loading and external links on the server', () => {
  const loading = renderToString(
    <Button loading={true} loadingText="Saving">
      Save
    </Button>
  );
  expect(loading).toContain('aria-disabled="true"');
  expect(loading).toContain('Saving');
  expect(renderToString(<Button iconName="add">Add</Button>)).toContain('<svg');
  const external = renderToString(
    <Button href="https://example.com" external={true}>
      Docs
    </Button>
  );
  expect(external).toContain('target="_blank"');
  expect(external).toContain('rel="noopener noreferrer"');
});
