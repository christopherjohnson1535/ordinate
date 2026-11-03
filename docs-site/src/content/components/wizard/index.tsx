// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Wizard',
  folder: 'wizard',
  group: 'guided-flows',
  summary: 'Takes the user through a task in steps, then submits it.',
  description: (
    <>
      <p>
        The wizard has two layouts. The <code>steps</code> variant shows one step at a time under a step scale that runs
        across the top: a dimension line with a tick for each step, labelled S1, S2 and so on with the step&rsquo;s
        name, inked up to the current step. The step takes the full width, with the buttons on a construction line
        closed by hash marks at its foot. Its <code>kind</code> colors the scale and the references.
      </p>
      <p>
        The default <code>checklist</code> variant puts every step on one sheet as an item numbered in the margin. The
        open item shows its content, and items the user has left fold to a one-line summary with a Change button. The
        footer counts the required items checked and the open errors, and the sheet can be submitted once every required
        item has been opened and no item has an error.
      </p>
      <p>
        The wizard does not validate. Set <code>activeStepIndex</code> and update it from <code>onNavigate</code> to
        check a step before moving on, and put the step&rsquo;s problem in its <code>errorText</code>.
      </p>
    </>
  ),
  marks: ['M1', 'M2', 'M3', 'M8'],
  examples: [
    {
      id: 'steps',
      title: 'One step at a time',
      description: (
        <p>
          A cluster set up in three steps. Next is refused while the first step has errors: the example checks the
          fields in <code>onNavigate</code> and only moves on when they pass. The last step&rsquo;s primary button
          submits.
        </p>
      ),
    },
    {
      id: 'checklist',
      title: 'A checklist sheet',
      description: (
        <p>
          The items can be filled in any order. An item with <code>errorText</code> is circled with a revision cloud and
          counted in the footer, and the sheet cannot be issued until it is cleared. An optional item does not need to
          be opened. <code>aside</code> adds a column beside the sheet, and <code>secondaryActions</code> sits at the
          start of the footer.
        </p>
      ),
    },
    {
      id: 'skip-and-load',
      title: 'Optional steps and a slow next step',
      description: (
        <p>
          With <code>allowSkipTo</code>, a Skip button jumps past optional steps to the next required one.{' '}
          <code>isLoadingNextStep</code> shows Next as loading and holds the navigation while the next step is prepared,
          here for about a second.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a task with several parts that the user completes once, such as creating a resource.',
      'With the steps variant when each step depends on the one before; with a checklist when the parts can be filled in any order.',
      'With a review step at the end of a steps wizard, so the user can check everything before submitting.',
    ],
    avoid: [
      <>
        For a short form that fits on one page. Use a <a href="#/components/form">Form</a>.
      </>,
      <>
        For showing the progress of work the system does. Use <a href="#/components/steps">Steps</a>.
      </>,
      'More than about seven steps. Combine steps, or split the task.',
    ],
    writing: [
      'Title each step with what the user does in it, in a few words: "Choose capacity".',
      'Name the submit button after the result: "Create cluster", not "Submit".',
      'Write a checklist item’s summary from the values chosen, such as "3 nodes, us-mountain-1".',
      'In an error, say what is wrong and what to do.',
    ],
  },
  accessibility: [
    <>
      In the steps variant the step scale is a navigation landmark named &ldquo;Steps&rdquo;. Steps the user has reached
      are buttons; the current step carries <code>aria-current=&quot;step&quot;</code>, and steps out of reach are plain
      text that keeps readable contrast.
    </>,
    'When the step changes, focus moves to the new step’s heading, so keyboard and screen reader users start reading it from the top.',
    'Each checklist item is a group named by its title, and the open item carries aria-current="step". The footer count is a live region, so changes to it are announced.',
    'An item with an error is described by its error text. The revision mark beside it is drawing only.',
    'While isLoadingNextStep is set, the next button announces its loading text.',
  ],
  related: ['form', 'steps', 'form-field', 'container'],
};

export default doc;
