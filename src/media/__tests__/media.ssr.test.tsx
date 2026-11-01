// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Media from '../../../lib/components/media';

test('renders on the server', () => {
  const html = renderToString(
    <>
      <Media src="/loaves.jpg" alt="Fresh loaves" />
      <Media placeholderText="Photo to come" />
    </>
  );
  expect(html).toContain('alt="Fresh loaves"');
  expect(html).toContain('Photo to come');
});
