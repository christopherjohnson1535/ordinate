// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Form from '../../../lib/components/form';

test('renders on the server', () => {
  const html = renderToString(
    <Form header={<h1>Create project</h1>} actions={<button>Create</button>} errorText="The request failed.">
      Fields
    </Form>
  );
  expect(html).toContain('Create project');
  expect(html).toContain('Fields');
  expect(html).toContain('The request failed.');
  expect(html).not.toContain('<form');
});
