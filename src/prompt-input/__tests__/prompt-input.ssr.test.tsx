// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import PromptInput from '../../../lib/components/prompt-input';

test('renders on the server with the minimum rows', () => {
  const html = renderToString(
    <PromptInput value="Hello" ariaLabel="Prompt" minRows={2} secondaryContent={<span>notes.txt</span>} />
  );
  expect(html).toContain('<textarea');
  expect(html).toContain('rows="2"');
  expect(html).toContain('Hello</textarea>');
  expect(html).toContain('aria-label="Send"');
  expect(html).toContain('notes.txt');
});
