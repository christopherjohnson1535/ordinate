// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import TagEditor from '../../../lib/components/tag-editor';

test('renders on the server', () => {
  const html = renderToString(
    <TagEditor
      tags={[
        { key: 'team', value: 'platform', existing: true },
        { key: 'stage', value: 'beta', existing: true, markedForRemoval: true },
      ]}
    />
  );
  expect(html).toContain('value="team"');
  expect(html).toContain('value="platform"');
  expect(html).toContain('This tag will be removed when you save changes.');
  expect(html).toContain('Undo');
  expect(html).toContain('You can add 49 more tags.');
});

test('renders the loading state on the server', () => {
  const html = renderToString(<TagEditor loading={true} />);
  expect(html).toContain('Loading tags');
});
