// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Journey from '../../../lib/components/journey';
import Tiles from '../../../lib/components/tiles';

test('renders on the server', () => {
  const html = renderToString(
    <Journey
      activeStepIndex={1}
      finishButtonText="Send my request"
      steps={[
        { id: 'room', question: 'Which room?', content: 'Room choices' },
        {
          id: 'start',
          question: 'When would you like to start?',
          isOptional: true,
          content: <Tiles value="soon" items={[{ value: 'soon', label: 'This season' }]} />,
        },
      ]}
    />
  );
  expect(html).toContain('Question 2 of 2');
  expect(html).toContain('<h2');
  expect(html).toContain('When would you like to start?');
  expect(html).toContain('This season');
  expect(html).toContain('Send my request');
  expect(html).toContain('Optional');
  expect(html).toContain('aria-hidden="true"');
});
