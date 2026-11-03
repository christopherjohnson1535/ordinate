// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'AnnotationContext',
  folder: 'annotation-context',
  group: 'guided-flows',
  summary: 'Runs a tutorial over a page, with a note at each control the steps point at.',
  description: (
    <>
      <p>
        AnnotationContext holds the tutorial in progress and the step the user is on. It draws nothing itself. Wrap the
        page in it, place a <a href="#/components/hotspot">Hotspot</a> next to each element a step points at, and a{' '}
        <a href="#/components/tutorial-panel">TutorialPanel</a> in the help column to list and start the tutorials.
      </p>
      <p>
        While a tutorial runs, each hotspot of the current task shows a circled number, and the current step opens an
        annotation at it: a plate tied to its hotspot by a leader from a dot, with the task, the step&rsquo;s title and
        text, a step counter and the previous and next buttons. The application keeps the tutorial in state: set{' '}
        <code>currentTutorial</code> from <code>onStartTutorial</code>, clear it from <code>onExitTutorial</code> and
        mark it <code>completed</code> from <code>onFinish</code>.
      </p>
    </>
  ),
  marks: ['M9', 'M7', 'M13'],
  examples: [
    {
      id: 'guided-help',
      title: 'Guided help on a form',
      description: (
        <p>
          Start the tutorial from the panel. The steps read the form, so an annotation carries a{' '}
          <code>warningAlert</code> while its field is empty. Finish it to see the completion screen; exit to return to
          the list.
        </p>
      ),
    },
    {
      id: 'started-by-the-page',
      title: 'A tour started by the page',
      description: (
        <p>
          A tutorial can run without a panel: set <code>currentTutorial</code> from any control. A different tutorial
          always starts at its first step. <code>onStepChange</code> reports each move with its reason, and{' '}
          <code>i18nStrings</code> renames the buttons and the counter.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For teaching a task on the page where the user does it, one control at a time.',
      'For a short tour of what changed on a page the user already knows.',
    ],
    avoid: [
      <>
        For help about one field. Use an info link that opens the <a href="#/components/help-panel">HelpPanel</a>, or a{' '}
        <a href="#/components/popover">Popover</a>.
      </>,
      <>
        For a task the application should lead step by step. Use a <a href="#/components/wizard">Wizard</a>.
      </>,
      'Starting a tour without the user asking for it on every visit.',
    ],
    writing: [
      'Title each step with the action, starting with a verb: "Choose a region".',
      'Keep a step to one or two sentences: what to do and why it matters.',
      'Use a warning when the page shows the step is not done yet, and say what to do.',
    ],
  },
  accessibility: [
    <>
      An annotation is a dialog named by its step title. Focus moves into it when the user starts the tutorial or moves
      between steps, and Tab stays inside it until it closes.
    </>,
    'Escape and the close button close the annotation and return focus to its hotspot. The hotspot reopens it.',
    <>
      Exiting or finishing a tutorial moves focus to the heading of the tutorial panel&rsquo;s new view, because the
      button that had focus is gone.
    </>,
    'The leader and dot that tie an annotation to its hotspot are drawing only.',
  ],
  related: ['hotspot', 'tutorial-panel', 'help-panel', 'popover'],
};

export default doc;
