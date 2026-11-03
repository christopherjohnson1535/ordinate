// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Alert',
  folder: 'alert',
  group: 'status',
  summary: 'Tells the user something about the page they are on that needs their attention.',
  description: (
    <>
      <p>
        An alert is a margin note, not a box. A construction line in the status color opens it, the icon and a mono
        caption naming the kind of note sit in a narrow margin, and the header, message and action follow in ink. Only
        the line, the icon and the caption carry color, so the text reads the same in every kind.
      </p>
      <p>
        The <code>type</code> is one of the status words used across the library: <code>note</code>,{' '}
        <code>complete</code>, <code>caution</code> and <code>fault</code>. When the alert is narrower than 400 px the
        margin moves above the message.
      </p>
    </>
  ),
  marks: ['M1', 'M2', 'M4'],
  examples: [
    {
      id: 'types',
      title: 'Types',
      description: (
        <p>
          <code>note</code> for information, <code>complete</code> for something that finished, <code>caution</code>{' '}
          for something that needs attention soon and <code>fault</code> for something that failed.
        </p>
      ),
    },
    {
      id: 'action-and-dismiss',
      title: 'Action and dismiss',
      description: (
        <p>
          <code>action</code> puts a button under the message. <code>dismissible</code> adds a close button; the alert
          is controlled, so remove it from the page in <code>onDismiss</code>.
        </p>
      ),
    },
    {
      id: 'focus',
      title: 'Moving focus to an alert',
      description: (
        <p>
          When an alert appears because of something the user did, call <code>focus()</code> on its ref so screen
          readers read it. Try renaming the project.
        </p>
      ),
    },
    {
      id: 'short',
      title: 'Header only and message only',
      description: (
        <p>
          Either part can stand alone. Use a header alone for a short confirmation and a message alone for a note that
          needs no summary.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For a message about the page or section the user is on, shown where it applies.',
      'For a problem that stops the user from going on, with an action that fixes it where there is one.',
      'For a short confirmation that stays on the page, such as a saved form.',
    ],
    avoid: [
      <>
        For messages about something that happened elsewhere or in the background. Use a{' '}
        <a href="#/components/flashbar">Flashbar</a> at the top of the page.
      </>,
      <>
        For the state of one item in a list or table. Use a{' '}
        <a href="#/components/status-indicator">StatusIndicator</a>.
      </>,
      <>
        For an error in one form field. Use the <code>errorText</code> of a{' '}
        <a href="#/components/form-field">FormField</a>.
      </>,
      'More than one alert of the same kind in a section. Combine them into one message.',
    ],
    writing: [
      'Keep the header to a short sentence that says what happened: "Deployment failed", not "Error".',
      'In the message, say why and what the user can do next.',
      'Name the action with a verb: "Update agents", "Renew certificate".',
      <>
        The margin says the kind (Note, Complete, Caution, Fault). Change those words with <code>i18nStrings</code>{' '}
        only to translate them.
      </>,
    ],
  },
  accessibility: [
    <>
      The message is a group named by its header. The kind is read from the caption in the margin, so the icon is
      decorative unless you set <code>statusIconAriaLabel</code>.
    </>,
    <>
      An alert is not announced when it appears. Call <code>focus()</code> on its ref after a user action, or wrap it in
      a <a href="#/components/live-region">LiveRegion</a>. Focus lands on the message without adding it to the tab
      order.
    </>,
    <>
      The close button is a native button named by <code>dismissAriaLabel</code>, &quot;Dismiss&quot; by default. Move
      focus somewhere sensible after the alert is removed.
    </>,
  ],
  related: ['flashbar', 'status-indicator', 'live-region', 'error-boundary'],
};

export default doc;
