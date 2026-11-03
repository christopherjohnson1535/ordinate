// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TutorialPanel',
  folder: 'tutorial-panel',
  group: 'guided-flows',
  summary: 'Lists the tutorials of a page in the help column and follows the one in progress.',
  description: (
    <>
      <p>
        The tutorial panel is a <a href="#/components/help-panel">HelpPanel</a>, a margin note against a faint
        construction line, with three views. With no tutorial running it lists the tutorials, each with a start button.
        While one runs it shows the tutorial&rsquo;s tasks and steps, each step with its S reference and an icon for
        done, in progress or not started, under a dimension line inked up to the current step. When the tutorial is
        completed it shows a completion screen above the same list.
      </p>
      <p>
        The panel must sit inside an <a href="#/components/annotation-context">AnnotationContext</a>, which starts the
        tutorials and tracks the step. Place it in the help column of an <a href="#/components/app-layout">AppLayout</a>
        .
      </p>
    </>
  ),
  marks: ['M1', 'M3', 'M4', 'M8'],
  examples: [
    {
      id: 'list',
      title: 'The list of tutorials',
      description: (
        <p>
          A completed tutorial offers a restart. One with <code>prerequisitesNeeded</code> shows its{' '}
          <code>prerequisitesAlert</code> and cannot be started. <code>downloadUrl</code> and{' '}
          <code>onFeedbackClick</code> add a download link above the list and a feedback link below it.
        </p>
      ),
    },
    {
      id: 'progress',
      title: 'A tutorial in progress',
      description: (
        <p>
          Start the tutorial: the panel switches to its tasks and steps and follows the user through the annotations.
          Finish the last step for the completion screen, or exit to go back to the list.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'In the help column, on a page that offers one or more tutorials.',
      'With tutorials that take a few minutes, split into tasks of two to five steps.',
    ],
    avoid: [
      <>
        For help that is read rather than followed. Use a <a href="#/components/help-panel">HelpPanel</a>.
      </>,
      'For a tutorial with a single step. Point at the control with a popover instead.',
    ],
    writing: [
      'Title tutorials with the goal: "Set up a project".',
      'Describe each tutorial in one sentence that says what the user will have done at the end.',
      'Say what to do first in a prerequisites alert, with a link if the task is elsewhere.',
    ],
  },
  accessibility: [
    'Each view starts with a heading, so screen reader users can tell the list, the tutorial in progress and the completion screen apart.',
    'Each step’s icon is named by its status, "Done", "In progress" or "Not started" by default, and the step in progress carries aria-current="step". Change the names with i18nStrings.labelsTaskStatus.',
    'The dimension line of progress is drawing only: the task and step statuses say the same in words.',
    'When the user exits or finishes a tutorial, focus moves to the heading of the view that replaces the button they used.',
  ],
  related: ['annotation-context', 'hotspot', 'help-panel', 'app-layout'],
};

export default doc;
