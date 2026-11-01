// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Dropdown from '../../../lib/components/dropdown';

test('renders open on the server', () => {
  const html = renderToString(
    <Dropdown
      open={true}
      trigger={<button>Filters</button>}
      header="Header"
      content="Content"
      footer="Footer"
      minWidth="small"
      maxWidth="medium"
      ariaRole="dialog"
      ariaLabel="Filters"
    />
  );
  expect(html).toContain('Filters</button>');
  expect(html).toContain('role="dialog"');
  expect(html).toContain('Content');
});

test('renders only the trigger when closed', () => {
  const html = renderToString(<Dropdown open={false} trigger={<button>Filters</button>} content="Content" />);
  expect(html).not.toContain('Content');
});
