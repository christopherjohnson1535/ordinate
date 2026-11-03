// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'BreadcrumbGroup',
  folder: 'breadcrumb-group',
  group: 'navigation',
  summary: 'Shows where the current page sits in the hierarchy and links back up it.',
  description: (
    <>
      <p>
        Breadcrumbs are joined by short leaders, the mark for &ldquo;goes somewhere else&rdquo;. Every item is a link
        except the last, which is the current page, set in ink and not linked.
      </p>
      <p>
        When the path does not fit, the middle items fold behind an ellipsis button, starting with the second. The
        first item and the current page always stay, and the current page is the one that truncates when even that is
        too wide.
      </p>
    </>
  ),
  marks: ['M7'],
  examples: [
    {
      id: 'basic',
      title: 'Path to a page',
      description: (
        <p>
          Start at the top of the hierarchy and end with the current page. Cancel <code>onFollow</code> to route on the
          client; <code>onClick</code> also fires for clicks with a modifier key.
        </p>
      ),
    },
    {
      id: 'collapsed',
      title: 'A long path',
      description: (
        <p>
          In a narrow space the middle folders fold behind the ellipsis. The button opens a menu of the hidden items;
          name it with <code>expandAriaLabel</code>. Narrow the window to see more of them fold.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'At the top of a page that sits two or more levels down a hierarchy, such as a service inside a project.',
      'With the same names the pages have in their titles and in the navigation.',
    ],
    avoid: [
      'On the top level of an application, where the path has only one item.',
      <>
        For the steps of a process. Use <a href="#/components/wizard">Wizard</a> or{' '}
        <a href="#/components/steps">Steps</a>.
      </>,
      'For the history of pages the user visited. Breadcrumbs show where a page lives, not how the user got there.',
    ],
    writing: [
      'Use the page titles, shortened if they are long, in sentence case.',
      'Do not repeat the application name if the top navigation already shows it.',
    ],
  },
  accessibility: [
    <>
      The group is a <code>&lt;nav&gt;</code> landmark named &ldquo;Breadcrumbs&rdquo; by default; set{' '}
      <code>ariaLabel</code> to change it. The items are an ordered list.
    </>,
    <>
      The current page carries <code>aria-current=&quot;page&quot;</code> and is not a link.
    </>,
    'The ellipsis button says whether its menu is open. In the menu, Up and Down move between the links, Escape closes it and returns focus to the button.',
    'The leaders between items are drawing only and hidden from screen readers.',
  ],
  related: ['side-navigation', 'top-navigation', 'link', 'header'],
};

export default doc;
