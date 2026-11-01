// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test, vi } from 'vitest';

import CodeEditor from '../../../lib/components/code-editor';
import FormField from '../../../lib/components/form-field';

const loadEditorEngine = vi.hoisted(() => vi.fn());

vi.mock('../../../lib/components/code-editor/engine/load', () => ({ loadEditorEngine }));

test('renders the loading shell on the server without loading the engine', () => {
  const html = renderToString(
    <FormField label="Policy">
      <CodeEditor value="{}" language="json" />
    </FormField>
  );
  expect(html).toContain('Policy');
  expect(html).toContain('Loading code editor');
  expect(html).toContain('JSON');
  expect(loadEditorEngine).not.toHaveBeenCalled();
});
