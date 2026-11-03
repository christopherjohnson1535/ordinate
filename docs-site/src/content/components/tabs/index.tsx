// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Tabs',
  folder: 'tabs',
  group: 'navigation',
  summary: 'Switches between views of the same thing in one place on the page.',
  description: (
    <>
      <p>
        The row of tabs stands on a construction line in the color of its <code>kind</code>, with no dividers between
        tabs. Small ink crop marks stand at the corners of the open tab, the mark for &ldquo;one of a set&rdquo;, and
        slide to the next tab when another opens. Each tab can carry a <code>reference</code> after its label, such as
        R1, in the kind&rsquo;s color.
      </p>
      <p>
        Only the open tab&rsquo;s content is rendered. Without <code>activeTabId</code> the tabs keep the open tab
        themselves, starting with the first that is not disabled. When the row is wider than its space it scrolls, with
        buttons at each end.
      </p>
    </>
  ),
  marks: ['M1', 'M5', 'M8'],
  examples: [
    {
      id: 'basic',
      title: 'Views of a resource',
      description: (
        <p>
          The default variant puts the tabs over the page. A disabled tab can still be reached with the keyboard; give
          it a <code>disabledReason</code>, shown on hover and focus.
        </p>
      ),
    },
    {
      id: 'container',
      title: 'Container',
      description: (
        <p>
          <code>container</code> draws the tabs and their content as one section, opened by a construction line like a
          Container. Use <code>stacked</code> when the section shares edges with sections next to it.
        </p>
      ),
    },
    {
      id: 'dismissible',
      title: 'Tabs the user opens and closes',
      description: (
        <p>
          <code>dismissible</code> adds a close button after the label, and Delete closes the focused tab. The tabs only
          report the close in <code>onDismiss</code>: remove the tab and pick the next one to open yourself.
        </p>
      ),
    },
    {
      id: 'overflow',
      title: 'More tabs than fit',
      description: (
        <p>
          The row scrolls when it is too wide. The arrow keys bring each tab into view; the scroll buttons at the ends
          are for the mouse.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For views of one thing that the user looks at one at a time, such as the details, nodes and logs of a service.',
      'With an href on each tab when each view has its own URL.',
    ],
    avoid: [
      <>
        For steps the user completes in order. Use a <a href="#/components/wizard">Wizard</a>.
      </>,
      <>
        For a choice that filters or changes one view. Use a{' '}
        <a href="#/components/segmented-control">SegmentedControl</a>.
      </>,
      <>
        For content the user needs to compare side by side. Show it on one page with{' '}
        <a href="#/components/container">Container</a> sections.
      </>,
      'Nesting tabs inside tabs.',
    ],
    writing: [
      'Label tabs with a short noun or two for what the view holds: "Logs", "Permissions".',
      'Keep labels in sentence case and of similar length.',
      'Say why a tab is disabled and what would make it available.',
    ],
  },
  accessibility: [
    <>
      The tabs follow the tab pattern: a <code>tablist</code> of <code>tab</code> elements, each controlling a{' '}
      <code>tabpanel</code>. Name the list with <code>ariaLabel</code> or <code>ariaLabelledby</code>.
    </>,
    'The tab list is one tab stop. Left and Right move between tabs and open them, wrapping at the ends, and Home and End go to the first and last tab. Left and Right follow the reading direction.',
    <>
      A disabled tab stays reachable and is marked <code>aria-disabled</code>, with its reason read as its description.
    </>,
    'Only the open tab’s close button is in the tab order. Delete closes the focused tab.',
    'The open panel is in the tab order, so keyboard users can reach content that has no focusable element.',
  ],
  related: ['segmented-control', 'container', 'side-navigation', 'anchor-navigation'],
};

export default doc;
