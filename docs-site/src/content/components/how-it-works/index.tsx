// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'HowItWorks',
  folder: 'how-it-works',
  group: 'website-flows',
  summary: 'Explains a process to website visitors as a few numbered steps.',
  description: (
    <>
      <p>
        HowItWorks lays out the steps of a process in order, such as booking a repair. It is an ordered list: each step
        opens with a heavy ink rule, as a section of a printed form does, then a large number in the headline face, the
        step's title, a sentence or two, and an optional picture. The rule's weight and the headline face follow the
        page style.
      </p>
      <p>
        It explains; it does not take the visitor through the steps. In the default <code>horizontal</code> orientation
        the steps sit side by side, as many as fit at a readable width, and wrap below. <code>vertical</code> always
        stacks them with the number beside each step.
      </p>
    </>
  ),
  examples: [
    {
      id: 'repair',
      title: 'Three steps',
      description: (
        <p>
          The usual case: three short steps under a section heading. The section's heading is level 2, so the step
          titles keep their default level 3. Shown in the <code>shopfront</code> style, where the rules are heavy.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'vertical',
      title: 'Stacked',
      description: (
        <p>
          <code>orientation="vertical"</code> for longer processes or a narrow column, with room for two-digit numbers.
          Shown in the <code>studio</code> style.
        </p>
      ),
      layout: 'flush',
    },
    {
      id: 'drawings',
      title: 'With drawings',
      description: (
        <p>
          Each step can carry a picture in <code>media</code>. With no heading nearby, <code>ariaLabel</code> names the
          list. Shown in the <code>editorial</code> style.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'On a website page, to answer "what happens if I book?" before the visitor commits.',
      'For three to five steps that happen in a fixed order.',
    ],
    avoid: [
      <>
        To take the visitor through a set of questions. Use a <a href="#/components/journey">Journey</a>.
      </>,
      <>
        For a task in an application with steps the user completes. Use a <a href="#/components/wizard">Wizard</a> or{' '}
        <a href="#/components/steps">Steps</a>.
      </>,
      'For items that have no order, such as a list of services. Use a ColumnLayout or cards.',
    ],
    writing: [
      'Title each step with a verb and what it acts on: "Book a slot", "Get a quote".',
      'Say what the visitor does or gets in the description, and how long it takes where that helps.',
      'Do not number the titles yourself; the component draws the numbers.',
    ],
  },
  accessibility: [
    <>
      The steps are an ordered list with <code>role="list"</code>, so screen readers announce the count and position
      even where list styling is removed.
    </>,
    'The drawn numbers are hidden from assistive technology, because the list already gives each step its position.',
    <>
      Step titles are headings at level 3 by default. Set <code>headingLevel</code> to fit the page outline.
    </>,
    <>
      Name the list with <code>ariaLabel</code> when no heading nearby says what the process is. Give pictures alt text,
      or hide them when they only decorate.
    </>,
  ],
  related: ['journey', 'section', 'steps', 'opening-hours'],
};

export default doc;
