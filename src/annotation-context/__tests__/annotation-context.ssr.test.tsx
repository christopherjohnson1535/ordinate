// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import AnnotationContext from '../../../lib/components/annotation-context';
import Hotspot from '../../../lib/components/hotspot';

test('renders the open annotation on the server', () => {
  const html = renderToString(
    <AnnotationContext
      currentTutorial={{
        title: 'Create a project',
        tasks: [{ title: 'Name it', steps: [{ title: 'Enter a name', content: 'Unique.', hotspotId: 'name' }] }],
      }}
    >
      <Hotspot hotspotId="name">Name</Hotspot>
    </AnnotationContext>
  );
  expect(html).toContain('role="dialog"');
  expect(html).toContain('Task 1: Name it');
  expect(html).toContain('Step 1 of 1');
  expect(html).toContain('Finish');
});

test('renders only the children without a tutorial', () => {
  const html = renderToString(
    <AnnotationContext currentTutorial={null}>
      <Hotspot hotspotId="name">Name</Hotspot>
    </AnnotationContext>
  );
  expect(html).toContain('Name');
  expect(html).not.toContain('<button');
});
