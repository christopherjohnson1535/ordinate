// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import FormField from '../../../lib/components/form-field';
import Textarea from '../../../lib/components/textarea';

test('renders on the server', () => {
  const html = renderToString(
    <FormField label="Notes">
      <Textarea value="Rotate keys monthly." />
    </FormField>
  );
  expect(html).toContain('Notes');
  expect(html).toContain('Rotate keys monthly.');
});
