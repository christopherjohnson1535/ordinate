// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Example } from '../../parts/example';
import { DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { LoadedExample } from '../../registry/types';
import { onSheet } from './shared/on-sheet';

const page: LoadedExample = {
  meta: {
    id: 'all-components',
    title: 'The specimen sheet',
    description: (
      <p>
        Every group of the library under its sheet number, every component in a cell with its name as a caption and a
        small working example. Scroll inside the frame, or switch the mode or revision above it.
      </p>
    ),
    layout: 'flush',
    height: 'tall',
  },
  load: onSheet(() => import('../../../../pages/examples/all-components.page')),
  loadSource: () => import('../../../../pages/examples/all-components.page.tsx?raw').then(module => module.default),
};

function Page() {
  return (
    <>
      <DocSection id="purpose" number={1} title="What the sheet is for">
        <Prose>
          <p>
            One sheet with the whole library on it, in the groups of the <a href="#/components">component index</a>. It
            is for comparing: does a new revision change a button and a table in the same way, does dark mode keep every
            key square readable, does compact density tighten every row. Set a mode, revision, style, density or
            direction for the site and every component on the sheet follows at once.
          </p>
          <p>
            It is a review sheet, not a page to copy. Each cell shows one component doing one thing; for how the
            components fit together on a real page, see the other patterns, starting with{' '}
            <a href="#/patterns/console">Console</a>.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="reading" number={2} title="Reading the sheet">
        <Notes
          items={[
            'Each group opens with a two-digit sheet number, its title and an ink rule, in the order of the component index.',
            'Each cell is captioned with the component name in small mono capitals. Some carry a line saying what to try.',
            'Components that fill their container, such as AppLayout, Drawer and SplitPanel, sit in a frame of fixed height.',
            'Interactive cells report what they did in a line of secondary text under the example.',
            'A Modal opens over the whole browser window, not only the frame, because it is a native modal dialog.',
          ]}
        />
      </DocSection>

      <DocSection id="page" number={3} title="The sheet">
        <Example example={page} index={1} />
      </DocSection>
    </>
  );
}

const doc: GuideDoc = {
  slug: 'all-components',
  title: 'Every component on one sheet',
  summary: 'The whole library on one specimen sheet, every component with a small working example.',
  order: 100,
  keywords: ['specimen', 'all components', 'kitchen sink', 'overview', 'review'],
  Page,
};

export default doc;
