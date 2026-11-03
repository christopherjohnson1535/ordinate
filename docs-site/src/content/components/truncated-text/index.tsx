// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'TruncatedText',
  folder: 'truncated-text',
  group: 'content',
  summary: 'Cuts text that does not fit with an ellipsis, and shows the rest in a tooltip.',
  description: (
    <>
      <p>
        TruncatedText keeps long text, such as a storage path or a summary, to one line or to the number of{' '}
        <code>lines</code> you set. When the text does not fit, it ends in an ellipsis and the full text appears in a
        tooltip, the ink chip on a stem, on hover and on keyboard focus.
      </p>
      <p>
        The text is measured again whenever its box changes size or the text changes, so the tooltip and the tab stop
        are there only while something is cut.
      </p>
    </>
  ),
  examples: [
    {
      id: 'one-line',
      title: 'One line',
      description: (
        <p>
          A long identifier in a narrow value column. Hover over the path, or tab to it, to read the whole of it. Text
          that fits is left alone.
        </p>
      ),
    },
    {
      id: 'lines',
      title: 'More than one line',
      description: (
        <p>
          <code>lines</code> lets a summary take a few lines before it is cut, so the reader gets the start of it in
          place.
        </p>
      ),
    },
    {
      id: 'resize',
      title: 'Following the width',
      description: (
        <p>Move the slider to change the width. The ellipsis and the tooltip come and go as the text stops fitting.</p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For identifiers, paths and names that are long but rarely read in full, in a table cell or a value column.',
      'For a summary that should keep a fixed height in a card or a list.',
    ],
    avoid: [
      'For text people need to read in full to act, such as an error or a warning. Let it wrap.',
      'For text with links or buttons. The tooltip is for text and inline elements only.',
      <>
        For a whole article. Use an <a href="#/components/expandable-section">ExpandableSection</a> to hide the rest.
      </>,
    ],
    writing: [
      'Put what tells items apart at the start, where it stays visible: "node-04 backup", not "Backup of node-04".',
    ],
  },
  accessibility: [
    'The whole text stays in the page, so screen readers read all of it whether or not it is cut.',
    'Cut text gets a tab stop, so keyboard users can open the tooltip with the rest of it. Text that fits is not focusable.',
    'The tooltip opens on focus as well as on hover, and closes with Escape.',
  ],
  related: ['tooltip', 'key-value-pairs', 'table'],
};

export default doc;
