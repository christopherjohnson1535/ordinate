// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TitleBlock',
  folder: 'title-block',
  group: 'layout',
  summary: 'States the facts of a whole page, such as project, sheet and revision, in a strip of labelled cells.',
  description: (
    <>
      <p>
        A title block is the strip along the foot of a drawing sheet: a heavy ink rule on top and a row of cells, each
        with a small mono label over its value, ruled off from each other. It draws no outer frame, so it sits flush
        inside a framed sheet, such as the <code>titleBlock</code> slot of an <code>AppLayout</code>.
      </p>
      <p>
        Cells share one row while there is room and wrap onto more rows as the space narrows. <code>columns</code> caps
        how many share a row.
      </p>
    </>
  ),
  marks: ['M4'],
  examples: [
    {
      id: 'sheet',
      title: 'Facts of a sheet',
      description: (
        <p>
          The project, sheet, revision and who drew and checked it. A value can be text, a <code>Link</code> or a{' '}
          <code>StatusIndicator</code>.
        </p>
      ),
    },
    {
      id: 'columns',
      title: 'Columns',
      description: (
        <p>
          A number from 1 to 6 sets the most cells on a row. Rows still hold fewer when cells would get too narrow to
          read.
        </p>
      ),
    },
    {
      id: 'labelled',
      title: 'Named by a heading',
      description: (
        <p>
          When a visible heading names the block, point to it with <code>ariaLabelledby</code>. Otherwise give an{' '}
          <code>ariaLabel</code>.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      <>
        At the foot of an application page, in the <code>titleBlock</code> of an{' '}
        <a href="#/components/app-layout">AppLayout</a>, for facts about the whole sheet.
      </>,
      'On a website, for the few facts of an order or a booking that the reader will look for.',
    ],
    avoid: [
      <>
        For the properties of one item in a section. Use <a href="#/components/key-value-pairs">KeyValuePairs</a>.
      </>,
      'More than six or seven cells. Keep it to the facts a reader checks first.',
    ],
    writing: [
      'Label each cell with a single noun, such as "Project", "Revision" or "Checked".',
      'Keep values short enough to fit on one or two lines.',
    ],
  },
  accessibility: [
    <>
      The block is a description list: each label is a <code>&lt;dt&gt;</code> and its value a <code>&lt;dd&gt;</code>,
      so screen readers read them in pairs.
    </>,
    <>
      Give the list a name with <code>ariaLabel</code> or <code>ariaLabelledby</code>, so it can be told apart from
      other lists on the page.
    </>,
  ],
  related: ['app-layout', 'key-value-pairs'],
};

export default doc;
