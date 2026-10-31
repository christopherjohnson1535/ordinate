// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import FormField from '../../../lib/components/form-field';
import Input from '../../../lib/components/input';

test('renders every slot on the server', () => {
  const html = renderToString(
    <FormField
      label="Capacity"
      info={<a href="#help">Info</a>}
      description="Number of nodes."
      constraintText="Between 1 and 100."
      characterCountText="2 of 3"
      warningText="More than 50 nodes takes longer."
      secondaryControl={<span>nodes</span>}
    >
      <Input value="80" />
    </FormField>
  );
  for (const text of [
    'Capacity',
    'Info',
    'Number of nodes.',
    'Between 1 and 100.',
    '2 of 3',
    'takes longer',
    'nodes',
  ]) {
    expect(html).toContain(text);
  }
});
