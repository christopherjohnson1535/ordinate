// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'ExpandableSection',
  folder: 'expandable-section',
  group: 'content',
  summary: 'Hides content that only some people need behind a header that opens and closes it.',
  description: (
    <>
      <p>
        The header is a button with a caret. Clicking it shows or hides the content below. The section keeps its own
        state, starting from <code>defaultExpanded</code>, or follows <code>expanded</code> when you control it.
      </p>
      <p>
        The <code>container</code> and <code>stacked</code> variants open with a construction line, like a
        container, and draw <code>headerCounter</code> as a dimension line under the heading. They are also the only
        variants that show <code>headerInfo</code> and <code>headerActions</code>. The <code>footer</code>,{' '}
        <code>navigation</code> and <code>inline</code> variants are lighter disclosures for a container footer, side
        navigation and running content.
      </p>
    </>
  ),
  marks: ['M1', 'M3'],
  examples: [
    {
      id: 'default',
      title: 'Default',
      description: (
        <p>
          A plain disclosure inside other content. <code>headerDescription</code> adds a line under the header that
          says what is inside.
        </p>
      ),
    },
    {
      id: 'container',
      title: 'Container',
      description: (
        <p>
          The <code>container</code> variant is a section that can close. Its count stands on a dimension line, and
          actions sit at the end of the header row, outside the button.
        </p>
      ),
    },
    {
      id: 'stacked',
      title: 'Stacked',
      description: (
        <p>
          Stacked sections share their borders, for a page of settings that people open one group at a time.
        </p>
      ),
    },
    {
      id: 'controlled',
      title: 'Controlled',
      description: (
        <p>
          Set <code>expanded</code> and update it in <code>onChange</code> when something else on the page opens or
          closes the section.
        </p>
      ),
    },
    {
      id: 'footer-and-inline',
      title: 'Footer and inline',
      description: (
        <p>
          The <code>footer</code> variant fits a container’s footer, which already draws the rule above it. The{' '}
          <code>inline</code> variant is compact enough for a detail inside running content.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For details that most people skip, such as advanced settings or a full error message.',
      'For long pages of settings, with the stacked variant, so people open the group they need.',
      'In a container footer, for extra details about the item.',
    ],
    avoid: [
      'For content most people need. Show it, and let them scroll.',
      <>
        For switching between views of the same thing. Use <a href="#/components/tabs">Tabs</a>.
      </>,
      'Nesting sections inside each other more than one level deep.',
      'Buttons or links in the header text. The header is a button, so put actions in headerActions.',
    ],
    writing: [
      'Name what is inside, as a noun phrase: "Advanced settings", "Deployment log".',
      'Use headerDescription to say what the section holds when the header alone does not.',
      'Use sentence case and no closing punctuation.',
    ],
  },
  accessibility: [
    <>
      The header is a native <code>&lt;button&gt;</code> with <code>aria-expanded</code> and{' '}
      <code>aria-controls</code>, so it opens and closes with Enter and Space and screen readers announce its state.
    </>,
    <>
      The content is a <code>group</code> named by the header. It is hidden with the <code>hidden</code> attribute
      while the section is closed, so nothing inside it can be focused.
    </>,
    <>
      <code>headerDescription</code> is the button’s accessible description. <code>headerCounter</code> is read as
      part of the button’s name; the dimension line is drawing only.
    </>,
    <>
      The <code>container</code> and <code>stacked</code> variants put the button in an <code>h2</code>. Use{' '}
      <code>headingTagOverride</code> to fit the page outline, and to add a heading to the other variants.
    </>,
    <>
      Use <code>headerAriaLabel</code> when the header text alone does not say what the section is. The{' '}
      <code>focus()</code> method of the ref moves focus to the button.
    </>,
  ],
  related: ['container', 'tabs', 'side-navigation', 'key-value-pairs'],
};

export default doc;
