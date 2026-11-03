// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Journey',
  folder: 'journey',
  group: 'website-flows',
  summary: 'Asks website visitors a few questions, one per screen, to book, enquire or find the right thing.',
  description: (
    <>
      <p>
        A journey shows one question at a time, as a large heading, with the way to answer it below and Back and
        Continue buttons at the end. Above the question a drafting ruler measures progress: a major tick between
        questions, finer ticks within each, and an inked run up to the question shown, with a counter such as "Question
        2 of 3" beside it. On the last question the continue button becomes the finish button.
      </p>
      <p>
        Put <a href="#/components/tiles">Tiles</a> in a question for choices: inside a journey they are drawn as large
        answer tiles and are named by the question. For written answers use a{' '}
        <a href="#/components/form-field">FormField</a>. The journey is a form, so Enter in a text field continues. It
        moves between questions on its own; set <code>activeStepIndex</code> with <code>onNavigate</code> to check an
        answer before moving on.
      </p>
    </>
  ),
  marks: ['M3'],
  examples: [
    {
      id: 'booking',
      title: 'Booking a repair',
      description: (
        <p>
          Three questions with answer tiles and a text field, with no checks. The journey keeps its own place, and{' '}
          <code>onFinish</code> shows a confirmation. Shown in the <code>shopfront</code> style.
        </p>
      ),
    },
    {
      id: 'validation',
      title: 'Checking answers',
      description: (
        <p>
          A controlled journey: <code>onNavigate</code> moves on only when the answer is there, and{' '}
          <code>errorText</code> says what is missing. While the request is sent, <code>isLoading</code> holds the
          buttons. Shown in the <code>studio</code> style.
        </p>
      ),
    },
    {
      id: 'labels',
      title: 'Own labels',
      description: (
        <p>
          <code>i18nStrings</code> replaces the button labels and the counter. The line below shows what{' '}
          <code>onNavigate</code> reported. Shown in the <code>editorial</code> style.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'On a website, for a short enquiry or booking that is easier one question at a time: what, when, how to reach you.',
      'For two to six questions. Ask only what you need to reply.',
      <>
        With <code>isOptional</code> on a question that can be skipped, so the visitor sees it can be left blank.
      </>,
    ],
    avoid: [
      <>
        For a task in an application, with steps a user reviews and edits. Use a{' '}
        <a href="#/components/wizard">Wizard</a>.
      </>,
      <>
        To explain a process the visitor does not go through here. Use{' '}
        <a href="#/components/how-it-works">HowItWorks</a>.
      </>,
      <>
        For a single email field. Use a form in a <a href="#/components/call-to-action">CallToAction</a>.
      </>,
    ],
    writing: [
      'Write each question as you would ask it across a counter: "When would you like to start?"',
      'Use the description for the one thing that helps answer, such as "It is not a quote."',
      'Name the finish button after what happens: "Send my request", "Book the repair".',
      'Say what is missing in the error and how to fix it: "Choose the room you have in mind."',
    ],
  },
  accessibility: [
    'When the question changes, focus moves to its heading, so keyboard and screen reader users start on the new question.',
    'The question heading is described by the counter, so "Question 2 of 3" is read with it. The ruler only repeats the counter and is hidden from assistive technology.',
    'Answer tiles placed in a question form a radio group named by the question and described by its description.',
    <>
      Errors appear in a region with <code>role="alert"</code>, so <code>errorText</code> is announced when it is set.
      Put field-level errors on each <code>FormField</code> as well.
    </>,
    <>
      While <code>isLoading</code> is set, the continue button shows as loading and announces its loading text, the back
      button is disabled, and submitting does nothing.
    </>,
    <>
      The question is a heading at level 2 by default. Set <code>headingLevel</code> to fit the page outline.
    </>,
  ],
  related: ['tiles', 'how-it-works', 'wizard', 'form-field', 'call-to-action'],
};

export default doc;
