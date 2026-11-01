// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import TitleBlock from '../../../lib/components/title-block';

test('renders on the server', () => {
  const html = renderToString(
    <TitleBlock
      columns={3}
      items={[
        { label: 'Project', value: 'North Annex' },
        { label: 'Revision', value: '△2' },
      ]}
    />
  );
  expect(html).toContain('<dl');
  expect(html).toContain('<dt');
  expect(html).toContain('North Annex');
});
