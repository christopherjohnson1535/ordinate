// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Divider',
  folder: 'divider',
  group: 'content',
  summary: 'Separates stacked sections, or items side by side, with a hairline rule.',
  description: (
    <>
      <p>
        A divider is a hairline in the divider color. Horizontal, it spans the full width between stacked sections;
        vertical, it stands the full height of a flex row between items placed side by side.
      </p>
      <p>
        A horizontal divider can carry a short label in its middle, such as “or” between two ways to sign in. The line
        breaks around the label and keeps a minimum length on each side as the label wraps.
      </p>
    </>
  ),
  examples: [
    {
      id: 'between-sections',
      title: 'Between sections',
      description: <p>Use a horizontal divider where space alone does not separate two groups of content.</p>,
    },
    {
      id: 'label',
      title: 'With a label',
      description: (
        <p>
          The children become a label in the middle of the line. Keep it to a word or two, such as a choice between two
          paths.
        </p>
      ),
    },
    {
      id: 'vertical',
      title: 'Vertical',
      description: (
        <p>
          <code>orientation="vertical"</code> stands between items in a row, such as horizontal{' '}
          <code>SpaceBetween</code>. Vertical dividers do not show a label.
        </p>
      ),
      layout: 'centered',
    },
  ],
  guidelines: {
    use: [
      'Between groups of content that space alone does not keep apart.',
      'With a short label, to split two alternatives such as two ways to sign in.',
      'Vertically, between short facts set in one row.',
    ],
    avoid: [
      <>
        To open a section with a heading. Use a <a href="#/components/container">Container</a>, which draws its own
        construction line.
      </>,
      'Between every item of a list. Space and alignment already group them.',
      'A label on a vertical divider. It is not shown, and a warning is logged in development.',
    ],
    writing: ['Keep a label to one or two words, in sentence case and with no closing punctuation.'],
  },
  accessibility: [
    <>
      An unlabelled divider is an <code>&lt;hr&gt;</code>, which screen readers announce as a separator. A vertical one
      also has <code>aria-orientation="vertical"</code>.
    </>,
    <>
      A labelled divider has <code>role="separator"</code> and is named by its label through{' '}
      <code>aria-labelledby</code>.
    </>,
    'A divider is not focusable and takes no input.',
  ],
  related: ['box', 'space-between', 'container'],
};

export default doc;
