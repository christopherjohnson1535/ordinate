// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'ButtonGroup',
  folder: 'button-group',
  group: 'actions',
  summary: 'Shows a row of compact icon actions as one toolbar, each named by a tooltip.',
  description: (
    <>
      <p>
        A button group is a toolbar of icon buttons that lie on the sheet with no offset, so a row of actions stays
        light. A pressed toggle is filled with ink. Groups of related actions are set apart by a short tick, and a menu
        action opens a plate like a <a href="#/components/button-dropdown">ButtonDropdown</a>.
      </p>
      <p>
        Every action shows its <code>text</code> in a tooltip on hover and focus, and the same text is its accessible
        name. The toolbar holds one tab stop; the arrow keys move between its actions.
      </p>
    </>
  ),
  marks: ['M10', 'M9'],
  examples: [
    {
      id: 'basic',
      title: 'Icon actions',
      description: (
        <p>
          Each <code>icon-button</code> needs an <code>id</code>, a short <code>text</code> and an icon. A{' '}
          <code>popoverFeedback</code> message shows next to the button and is announced after a click, such as
          &ldquo;Link copied&rdquo;.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'groups-and-toggles',
      title: 'Groups and toggles',
      description: (
        <p>
          A <code>group</code> holds related actions under a label that screen readers announce. An{' '}
          <code>icon-toggle-button</code> stays pressed: <code>event.detail.pressed</code> is the state to set.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'feedback',
      title: 'Actions under a response',
      description: (
        <p>
          Rating, copying and a <code>menu-dropdown</code> for the rest, under a generated answer. The two ratings are
          separate toggles; the application keeps only one pressed.
        </p>
      ),
      height: 'short',
    },
  ],
  guidelines: {
    use: [
      'For a row of frequent actions on one object, such as a drawing, a log or a chat response.',
      'When each action is clear from a familiar icon and a short tooltip.',
    ],
    avoid: [
      <>
        For actions that need words to be understood. Use <a href="#/components/button">Buttons</a> with text.
      </>,
      <>
        For choosing one option of a set, such as a view. Use a{' '}
        <a href="#/components/segmented-control">SegmentedControl</a>.
      </>,
      'More than about six actions in one row. Move the rare ones into a menu-dropdown.',
    ],
    writing: [
      'Keep text to one to three words, because it is both the tooltip and the accessible name: "Copy", "Zoom in".',
      'Keep a toggle’s text the same in both states. The pressed state is announced separately.',
      'Word popoverFeedback as a short past-tense confirmation: "Link copied".',
    ],
  },
  accessibility: [
    <>
      The group is a <code>toolbar</code> named by the required <code>ariaLabel</code>, and each group inside it is a{' '}
      <code>group</code> named by its <code>text</code>.
    </>,
    'The toolbar is one tab stop. The left and right arrows move between actions, following the reading direction, and Home and End go to the first and last. Disabled actions are skipped. Tabbing back in returns to the last action used.',
    <>
      Each action&apos;s <code>text</code> is its accessible name, so the tooltip is not linked a second time as its
      description.
    </>,
    <>
      Toggle actions have <code>aria-pressed</code>. Feedback messages are a polite live region, so they are announced
      after the click.
    </>,
    'Keys pressed inside an open menu belong to the menu, as in ButtonDropdown.',
  ],
  related: ['button-dropdown', 'toggle-button', 'tooltip', 'copy-to-clipboard'],
};

export default doc;
