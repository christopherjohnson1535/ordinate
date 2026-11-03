// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Stamp',
  folder: 'stamp',
  group: 'status',
  summary: 'Marks a whole document or record with its standing, such as Approved or Draft, like a rubber stamp.',
  description: (
    <>
      <p>
        A stamp is a word or two in bold mono capitals inside a double rule, set a little askew as if pressed by hand.
        The whole stamp, rule and text, takes the color of its <code>type</code>. A <code>draft</code> stamp is drawn
        with a dashed rule in gray, for work that has not been issued.
      </p>
      <p>
        Stamp names its types <code>success</code>, <code>info</code>, <code>warning</code> and <code>error</code>. They
        use the same colors as the status words elsewhere in the library: complete, note, caution and fault.
      </p>
    </>
  ),
  examples: [
    {
      id: 'types',
      title: 'Types',
      description: (
        <p>
          The four status types, <code>neutral</code> for a state with no judgement in it and <code>draft</code> for
          work not issued yet.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'beside-a-title',
      title: 'Beside a title',
      description: (
        <p>
          The <code>medium</code> size, the default, sits beside a page or section title. Approve the change request to
          swap the stamp.
        </p>
      ),
    },
    {
      id: 'small',
      title: 'In a table',
      description: (
        <p>
          <code>size=&quot;small&quot;</code> fits a line of text or a table cell.{' '}
          <code>rotation=&quot;none&quot;</code> keeps a column of stamps level so it scans cleanly.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For the standing of a whole document, record or request: approved, rejected, draft, archived.',
      'Once per page or per row. A stamp is meant to be noticed.',
    ],
    avoid: [
      <>
        For the running state of a resource, such as Running or Stopped. Use a{' '}
        <a href="#/components/status-indicator">StatusIndicator</a>.
      </>,
      <>
        For a category or a severity. Use a <a href="#/components/badge">Badge</a>.
      </>,
      'Several stamps side by side on the same thing. Pick the one that matters now.',
    ],
    writing: [
      'One or two words, in sentence case. The stamp sets them in capitals.',
      'Use a past participle or a state: "Approved", "On hold", "Superseded".',
    ],
  },
  accessibility: [
    'The stamp is a plain span. Screen readers read the words as written, not in capitals, so they must say the state on their own.',
    'The tilt is only drawn; the text stays in reading order.',
    'Color is not the only signal: the words carry the meaning, and a draft stamp also differs by its dashed rule.',
  ],
  related: ['badge', 'status-indicator', 'header'],
};

export default doc;
