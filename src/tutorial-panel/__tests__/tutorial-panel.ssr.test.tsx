// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import AnnotationContext from '../../../lib/components/annotation-context';
import TutorialPanel, { TutorialPanelProps } from '../../../lib/components/tutorial-panel';

const tutorial: TutorialPanelProps.Tutorial = {
  title: 'Create a project',
  tasks: [{ title: 'Name it', steps: [{ title: 'Enter a name', content: 'Unique.', hotspotId: 'name' }] }],
};

test('renders the list on the server', () => {
  const html = renderToString(
    <AnnotationContext currentTutorial={null}>
      <TutorialPanel tutorials={[tutorial]} />
    </AnnotationContext>
  );
  expect(html).toContain('Tutorials');
  expect(html).toContain('Start tutorial');
});

test('renders the current tutorial on the server', () => {
  const html = renderToString(
    <AnnotationContext currentTutorial={tutorial}>
      <TutorialPanel tutorials={[tutorial]} />
    </AnnotationContext>
  );
  expect(html).toContain('Task 1: Name it');
  expect(html).toContain('aria-current="step"');
});
