// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Token',
  folder: 'token',
  group: 'collections',
  summary: 'Shows one chosen value as a small label the user can remove.',
  description: (
    <>
      <p>
        A token is a hairline box on the sheet with a dismiss mark at its end. It lies on the sheet, so it has no offset
        and no shadow. The <code>normal</code> variant has room for a label tag, a description and a row of tags; the{' '}
        <code>inline</code> variant is one small line that sits in running text and cuts a label that does not fit,
        showing the whole of it in a tooltip.
      </p>
      <p>
        A token has a dismiss button only when you pass <code>onDismiss</code>, and removing the token is up to you. To
        show several tokens with focus handled between them, use a <a href="#/components/token-group">TokenGroup</a>.
      </p>
    </>
  ),
  marks: ['M12'],
  examples: [
    {
      id: 'normal',
      title: 'A chosen value',
      description: (
        <p>
          The normal variant shows the label, a <code>labelTag</code> such as an ID, a <code>description</code> and{' '}
          <code>tags</code>. Name the token in <code>dismissLabel</code>, so the button reads as "Remove EU North".
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'inline',
      title: 'Inline tokens',
      description: (
        <p>
          The inline variant sits on a line of text. A long label is cut; <code>tooltipContent</code> puts the full
          form, such as a whole path, in the tooltip instead of the label.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Disabled and read-only',
      description: (
        <p>
          <code>disabled</code> hatches and dims the token and removes its dismiss button. <code>readOnly</code> keeps
          it at full contrast on a read-only ground, for a value the user can see but not change here.
        </p>
      ),
      layout: 'centered',
    },
  ],
  guidelines: {
    use: [
      'For one value a user has picked, shown under the control they picked it with, such as a file or a region.',
      'For a short reference inside running text, such as an image tag, with the inline variant.',
    ],
    avoid: [
      <>
        For several picked values. Use a <a href="#/components/token-group">TokenGroup</a>, which moves focus to the
        next token when one is removed.
      </>,
      <>
        For a status or a category that cannot be removed. Use a <a href="#/components/badge">Badge</a> or a{' '}
        <a href="#/components/status-indicator">StatusIndicator</a>.
      </>,
      'An onDismiss that does nothing: a dismiss button must remove the value.',
    ],
    writing: [
      'Use the value’s own name for the label, as the user picked it.',
      'Keep the description to a few words, such as a city for a region or a size for a file.',
      'Write dismissLabel as "Remove" and the label.',
    ],
  },
  accessibility: [
    <>
      The dismiss button is a native button named by <code>dismissLabel</code>, or "Remove" when it is not set. Always
      set it, so a list of tokens does not read as a row of identical buttons.
    </>,
    'A cut inline label becomes focusable, so keyboard users can open the tooltip with the rest of it.',
    'An icon is drawing unless you give it an ariaLabel; give it one when it says something the label does not.',
    'Disabled and read-only tokens have no dismiss button.',
  ],
  related: ['token-group', 'multiselect', 'file-token-group', 'badge'],
};

export default doc;
